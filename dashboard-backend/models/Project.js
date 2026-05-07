const mongoose = require('mongoose');

const MilestoneSchema = new mongoose.Schema({
  id: Number,
  name: String,
  dueDate: String,
  done: Boolean
});

const RiskSchema = new mongoose.Schema({
  id: Number,
  title: String,
  severity: String,
  mitigation: String
});

const DocumentSchema = new mongoose.Schema({
  id: Number,
  name: String,
  type: String,
  size: String,
  date: String
});

// Media items (photos / videos stored as base64 dataURLs)
const MediaSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.Mixed }, // Number or string timestamp
  name: String,
  mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
  dataUrl: { type: String, maxlength: 20000000 }, // up to ~15 MB base64
  date: String
});

const ProjectSchema = new mongoose.Schema({
  id: Number,
  // Optional: store the real district/city name (e.g., Mullaitivu, Polonnaruwa)
  // so map markers can be placed precisely.
  district: String,
  department: String,
  budgetLine: String,
  projectNumber: Number,
  projectName: String,
  startDate: String,
  endDate: String,
  npd: String,
  tec: String,
  awardedSum: String,
  revisedCost: String,
  physicalProgress: String,
  financialProgress: String,
  allocation2026: String,
  kpi: String,
  output: String,
  outcome: String,
  responsibleOfficer: String,
  reasonsForDelays: String,
  remarks: String,
  milestones: [MilestoneSchema],
  risks: [RiskSchema],
  documents: [DocumentSchema],
  media: [MediaSchema],
  measures: { type: mongoose.Schema.Types.Mixed },
  // Monthly progress: { january: { pt, pp, ft, fp }, february: { ... }, … }
  monthlyProgress: { type: mongoose.Schema.Types.Mixed, default: {} }
}, {
  // Allow any extra fields that the frontend might send
  strict: false
});

module.exports = mongoose.models.Project || mongoose.model('Project', ProjectSchema, 'projects');