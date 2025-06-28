import express from 'express';
import CustomCommand from '../models/CustomCommand.js';
import { registerCustomCommand, deleteCustomCommand } from '../services/discordSlashCommands.js';

const router = express.Router();

// GET all custom commands
router.get('/', async (req, res) => {
  const cmds = await CustomCommand.find();
  res.json(cmds);
});

// POST create new custom command
router.post('/', async (req, res) => {
  const { name, action, message } = req.body;
  if (!name || !action) return res.status(400).send("Missing fields");
  const exists = await CustomCommand.findOne({ name: name.toLowerCase() });
  if (exists) return res.status(400).send("Command already exists");
  const cmd = await CustomCommand.create({ name: name.toLowerCase(), action, message });
  await registerCustomCommand(cmd); // Register with Discord
  res.json(cmd);
});

// DELETE custom command
router.delete('/:name', async (req, res) => {
  const { name } = req.params;
  const cmd = await CustomCommand.findOneAndDelete({ name: name.toLowerCase() });
  if (cmd) {
    await deleteCustomCommand(cmd);
    res.json({ deleted: true });
  } else {
    res.status(404).send("Command not found");
  }
});

export default router;