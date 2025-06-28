import express from 'express';
import ModPermissions from '../models/ModPermissions.js';

const router = express.Router();

// GET roles allowed for a command
router.get('/:command', async (req, res) => {
  const perms = await ModPermissions.findOne({ command: req.params.command });
  res.json(perms || { roles: [] });
});

// POST set allowed roles for a command
router.post('/:command', async (req, res) => {
  const { roles } = req.body;
  let perms = await ModPermissions.findOneAndUpdate(
    { command: req.params.command },
    { roles },
    { upsert: true, new: true }
  );
  res.json(perms);
});

export default router;