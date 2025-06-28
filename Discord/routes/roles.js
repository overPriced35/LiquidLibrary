import express from 'express';
import { client } from "../discordClient.js";

const router = express.Router();

router.get('/:guildId', async (req, res) => {
  try {
    const guild = await client.guilds.fetch(req.params.guildId);
    await guild.roles.fetch();
    const roles = guild.roles.cache.map(r => ({ id: r.id, name: r.name }));
    res.json(roles);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;