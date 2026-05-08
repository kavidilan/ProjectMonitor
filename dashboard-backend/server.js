const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config(); // Loads variables from .env file

const projectRoutes = require('./routes/projectRoutes');
// Adjust this path if your project.js model is located elsewhere
const Project = require('./models/project');
const { parseWorkbook } = require('./utils/excelImport'); 

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
    if (!req.file?.buffer) {
      return res.status(400).json({ message: 'No Excel file was uploaded.' });
    }

    const { sheetName, budgetLine, importedRows } = parseWorkbook(req.file.buffer);
    const bulkOps = importedRows.map((project) => ({
      updateOne: {
        filter: { id: project.id },
        update: { $set: project },
        upsert: true,
      },
    }));

    if (bulkOps.length > 0) {
      await Project.bulkWrite(bulkOps, { ordered: false });
    }

    res.status(200).json({
      message: `Successfully synced ${importedRows.length} project${importedRows.length === 1 ? '' : 's'} from ${budgetLine}.`,
      sheetName,
      budgetLine,
      importedCount: importedRows.length,
    });
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