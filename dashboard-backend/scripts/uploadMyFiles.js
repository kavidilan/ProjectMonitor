const fs = require('fs');
const path = require('path');
const { parseWorkbook } = require('../utils/excelImport');
const mongoose = require('mongoose');
const Project = require('../models/project');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'project_dashboard';

const XLSX_DIR = 'C:\\Users\\ASUS\\OneDrive\\Desktop\\UDA Project XLSX';

async function main() {
  try {
    await mongoose.connect(MONGO_URI, { dbName: MONGO_DB_NAME });
    console.log('Connected to MongoDB');

    console.log('Wiping all existing projects to prevent duplicates...');
    await Project.deleteMany({});

    let totalImported = 0;

    const files = fs.readdirSync(XLSX_DIR).filter(f => f.endsWith('.xlsx'));
    
    for (const fileName of files) {
      const filePath = path.join(XLSX_DIR, fileName);
      console.log(`\nProcessing ${fileName}...`);
      try {
        const buffer = fs.readFileSync(filePath);
        const { sheetName, budgetLine, importedRows } = parseWorkbook(buffer, fileName);
        
        if (!importedRows || importedRows.length === 0) {
          console.log(`  No rows imported from ${fileName}.`);
          continue;
        }

        const bulkOps = importedRows.map((project) => ({
          updateOne: {
            filter: { id: project.id },
            update: { $set: project },
            upsert: true,
          },
        }));

        await Project.bulkWrite(bulkOps, { ordered: false });
        console.log(`  Successfully synced ${importedRows.length} projects from ${fileName}. (Budget Line: ${budgetLine})`);
        totalImported += importedRows.length;
      } catch (err) {
        console.error(`  Error processing ${fileName}:`, err.message);
      }
    }
    console.log(`\nDone uploading files. Total projects imported/updated: ${totalImported}`);
    process.exit(0);
  } catch (err) {
    console.error('Error in script:', err);
    process.exit(1);
  }
}

main();
