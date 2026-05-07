const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const xlsx = require('xlsx');
require('dotenv').config(); // Loads variables from .env file

const projectRoutes = require('./routes/projectRoutes');
// Adjust this path if your project.js model is located elsewhere
const Project = require('./models/project'); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); 

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'project_dashboard';

if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not set in dashboard-backend/.env');
  process.exit(1);
}

mongoose.connect(MONGO_URI, { dbName: MONGO_DB_NAME })
  .then(() => {
    console.log(`✅ Successfully connected to MongoDB database: ${MONGO_DB_NAME}`);
  })
  .catch((error) => {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  });

// --- EXCEL UPLOAD ROUTE ---
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/upload-excel', upload.single('file'), async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    
    // The UDA templates have headers starting lower down. 
    // Using range: 7 skips the first 7 rows of metadata.
    const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { range: 7 });

    const bulkOps = rawData.map(row => {
      // Handle slight variations in column names from the Excel files
      const projectName = row['Project Name / Sub Activities'] || row['Project Name                          / Sub Activities'];
      if (!projectName) return null;

      // Construct the nested monthly progress object
      const monthlyProgress = {
        january: { pt: row['January_PT'], pp: row['January_PP'], ft: row['January_FT'], fp: row['January_FP'] },
        february: { pt: row['February_PT'], pp: row['February_PP'], ft: row['February_FT'], fp: row['February_FP'] },
        march: { pt: row['March_PT'], pp: row['March_PP'], ft: row['March_FT'], fp: row['March_FP'] },
        april: { pt: row['April_PT'], pp: row['April_PP'], ft: row['April_FT'], fp: row['April_FP'] },
        may: { pt: row['May_PT'], pp: row['May_PP'], ft: row['May_FT'], fp: row['May_FP'] },
        june: { pt: row['June_PT'], pp: row['June_PP'], ft: row['June_FT'], fp: row['June_FP'] },
        july: { pt: row['July_PT'], pp: row['July_PP'], ft: row['July_FT'], fp: row['July_FP'] },
        august: { pt: row['August_PT'], pp: row['August_PP'], ft: row['August_FT'], fp: row['August_FP'] },
        september: { pt: row['September_PT'], pp: row['September_PP'], ft: row['September_FT'], fp: row['September_FP'] },
        october: { pt: row['October_PT'], pp: row['October_PP'], ft: row['October_FT'], fp: row['October_FP'] },
        november: { pt: row['November_PT'], pp: row['November_PP'], ft: row['November_FT'], fp: row['November_FP'] },
        december: { pt: row['December_PT'], pp: row['December_PP'], ft: row['December_FT'], fp: row['December_FP'] }
      };

      const updateData = {
        projectName: projectName.trim(),
        district: row['District'] || '',
        startDate: row['Date of Commencement'],
        endDate: row['Date of Completion'],
        tec: row['TEC ( Rs.Mn.)'],
        allocation2026: row['Allocation for 2026 ( Rs.Mn.)'],
        physicalProgress: row['Physical'],
        financialProgress: row['Financial'],
        output: row['Output'],
        outcome: row['Outcome'],
        monthlyProgress
      };

      return {
        updateOne: {
          filter: { projectName: updateData.projectName },
          update: { $set: updateData },
          upsert: true // Creates the project if it doesn't exist, updates if it does
        }
      };
    }).filter(op => op !== null);

    if (bulkOps.length > 0) {
      await Project.bulkWrite(bulkOps);
    }
    
    res.status(200).json({ message: `Successfully synced ${bulkOps.length} projects.` });
  } catch (error) {
    console.error("Excel Upload Error:", error);
    res.status(500).json({ error: "Failed to process Excel file." });
  }
});

// Routes
app.use('/api/projects', projectRoutes);

// Start Server
const parsedPort = Number(process.env.PORT);
const PORT = Number.isFinite(parsedPort) && parsedPort > 0 ? parsedPort : 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server is running on port ${PORT}`);
});