const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const Project = require('../models/Project');

function normalizeProject(p) {
  const next = { ...p };

  // Compass exports may include output/outcome inside `measures`
  const m = next.measures && typeof next.measures === 'object' ? next.measures : null;
  if (!next.output && m?.output) next.output = m.output;
  if (!next.outcome && m?.outcome) next.outcome = m.outcome;

  // Ensure numeric id exists (frontend uses it for editing)
  if (!next.id) next.id = Date.now();

  return next;
}

async function main() {
  const fileArg = process.argv[2] || path.join(__dirname, '..', 'seed', 'compass-projects.json');
  const mode = (process.argv[3] || '--upsert').toLowerCase();

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not set in environment/.env');
  }

  const raw = fs.readFileSync(fileArg, 'utf8');
  const parsed = JSON.parse(raw);
  const docs = (Array.isArray(parsed) ? parsed : [parsed]).map(normalizeProject);

  await mongoose.connect(process.env.MONGO_URI);

  if (mode === '--replace') {
    await Project.deleteMany({});
    await Project.insertMany(docs);
    console.log(`✅ Seeded ${docs.length} projects (replace).`);
  } else {
    // default: upsert by `id`
    let upserts = 0;
    for (const d of docs) {
      await Project.updateOne({ id: d.id }, { $set: d }, { upsert: true });
      upserts += 1;
    }
    console.log(`✅ Seeded ${upserts} projects (upsert).`);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});

