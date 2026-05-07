const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const mongoose = require('mongoose');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Frontend sends the authenticated account role in `x-user-role`.
// All configured portal roles can write.
const WRITE_ROLES = ['admin', 'dg', 'pmu', 'ddg_urban'];

function buildIdQuery(idParam) {
  // Support both numeric `id` field and MongoDB `_id`
  const asNumber = Number(idParam);
  if (!Number.isNaN(asNumber) && Number.isFinite(asNumber)) {
    return { id: asNumber };
  }
  if (mongoose.isValidObjectId(idParam)) {
    return { _id: idParam };
  }
  return null;
}

// GET all projects
router.get('/', protect, async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    console.error('GET /api/projects failed:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET one project (by numeric `id` or Mongo `_id`)
router.get('/:id', protect, async (req, res) => {
  try {
    const query = buildIdQuery(req.params.id);
    if (!query) return res.status(400).json({ message: 'Invalid id' });

    const project = await Project.findOne(query);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.json(project);
  } catch (err) {
    console.error('GET /api/projects/:id failed:', err);
    res.status(500).json({ message: err.message });
  }
});

// CREATE (single) or BULK SAVE (array)
router.post('/', protect, authorizeRoles(...WRITE_ROLES), async (req, res) => {
  try {
    const body = req.body;

    // If frontend sends an array, perform bulk upsert by `id`.
    // This avoids accidental full-collection wipes when client has partial data.
    if (Array.isArray(body)) {
      const validDocs = body.filter((doc) => doc && doc.id !== undefined && doc.id !== null);
      if (!validDocs.length) {
        return res.status(400).json({ message: 'No valid projects with id were provided' });
      }

      const incomingIds = validDocs.map((doc) => doc.id);
      await Project.deleteMany({ id: { $nin: incomingIds } });

      const ops = validDocs.map((doc) => ({
        updateOne: {
          filter: { id: doc.id },
          update: { $set: doc },
          upsert: true,
        },
      }));

      const result = await Project.bulkWrite(ops, { ordered: false });
      return res.status(200).json({
        message: 'Projects upserted successfully',
        matchedCount: result.matchedCount ?? 0,
        modifiedCount: result.modifiedCount ?? 0,
        upsertedCount: result.upsertedCount ?? 0,
      });
    }

    const created = await Project.create(body);
    return res.status(201).json(created);
  } catch (err) {
    console.error('POST /api/projects failed:', err);
    res.status(500).json({ message: err.message });
  }
});

// UPDATE (by numeric `id` or Mongo `_id`)
router.put('/:id', protect, authorizeRoles(...WRITE_ROLES), async (req, res) => {
  try {
    const query = buildIdQuery(req.params.id);
    if (!query) return res.status(400).json({ message: 'Invalid id' });

    // Use $set so every field in the body (including media[]) is written.
    // 'strict:false' on the schema allows extra fields to persist too.
    const updated = await Project.findOneAndUpdate(
      query,
      { $set: req.body },
      { new: true, runValidators: false }
    );

    if (!updated) return res.status(404).json({ message: 'Project not found' });
    return res.json(updated);
  } catch (err) {
    console.error('PUT /api/projects/:id failed:', err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE (by numeric `id` or Mongo `_id`)
router.delete('/:id', protect, authorizeRoles(...WRITE_ROLES), async (req, res) => {
  try {
    const query = buildIdQuery(req.params.id);
    if (!query) return res.status(400).json({ message: 'Invalid id' });

    const deleted = await Project.findOneAndDelete(query);
    if (!deleted) return res.status(404).json({ message: 'Project not found' });

    return res.json({ message: 'Project deleted' });
  } catch (err) {
    console.error('DELETE /api/projects/:id failed:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;