import express from "express";
import DefaultCommand from "../models/DefaultCommand.js";
import CustomCommand from "../models/CustomCommand.js";
import { client, rest } from "../discordClient.js";
import { Routes as DiscordRoutes } from "discord.js";

const router = express.Router();

// GET default commands for a guild
router.get("/:guildId", async (req, res) => {
  const { guildId } = req.params;
  try {
    const defaultList = ["info", "hello", "ping"];
    let commands = await DefaultCommand.find({ guildId });
    if (!commands.length) {
      commands = await DefaultCommand.insertMany(
        defaultList.map(name => ({ guildId, name, enabled: true }))
      );
    }
    res.json(commands.map(cmd => ({ name: cmd.name, enabled: cmd.enabled })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH enable/disable default command
router.patch("/:guildId/:commandName", async (req, res) => {
  const { guildId, commandName } = req.params;
  const { enabled } = req.body;
  try {
    const cmd = await DefaultCommand.findOneAndUpdate(
      { guildId, name: commandName },
      { enabled: !!enabled },
      { new: true, upsert: true }
    );
    res.json({ name: cmd.name, enabled: cmd.enabled });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET custom commands for a guild
router.get("/:guildId/custom", async (req, res) => {
  try {
    const cmds = await CustomCommand.find({ guildId: req.params.guildId });
    res.json(cmds);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST add/update a custom command and register with Discord
router.post("/:guildId/custom", async (req, res) => {
  const { guildId } = req.params;
  const { name, action, content, roles, channel } = req.body;
  if (!name || !action) return res.status(400).json({ error: "Missing name or action" });
  try {
    const cmd = await CustomCommand.findOneAndUpdate(
      { guildId, name },
      { action, content, roles, channel },
      { new: true, upsert: true }
    );
    await registerSlashCommandWithDiscord(guildId, cmd);
    res.json(cmd);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Register/Update a custom slash command with Discord
async function registerSlashCommandWithDiscord(guildId, cmd) {
  let options = [];
  switch (cmd.action) {
    case "send_message":
    case "send_dm":
      options = [
        { name: "text", description: "Message content", type: 3, required: false }
      ];
      break;
    case "send_channel":
      options = [
        { name: "channel", description: "Channel", type: 7, required: false },
        { name: "text", description: "Message content", type: 3, required: false }
      ];
      break;
    case "set_roles":
    case "give_roles":
    case "remove_roles":
    case "add_roles":
      options = [
        { name: "user", description: "Target user", type: 6, required: true },
        { name: "roles", description: "Roles (comma separated IDs)", type: 3, required: false }
      ];
      break;
    default:
      options = [];
  }
  const commandData = {
    name: cmd.name.toLowerCase(),
    description: `Custom command: ${cmd.action}`,
    options
  };
  try {
    const current = await rest.get(DiscordRoutes.applicationGuildCommands(process.env.CLIENT_ID, guildId));
    const otherCmds = current.filter(c => c.name !== cmd.name.toLowerCase());
    await rest.put(
      DiscordRoutes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
      { body: [...otherCmds, commandData] }
    );
  } catch (e) {
    console.error("Failed to register slash command:", e);
  }
}

// GET text channels for a guild
router.get("/channels/:guildId", async (req, res) => {
  try {
    const guild = await client.guilds.fetch(req.params.guildId);
    await guild.channels.fetch();
    const chans = guild.channels.cache
      .filter(ch => ch.type === 0) // 0 = GuildText
      .map(ch => ({ id: ch.id, name: ch.name }));
    res.json(chans);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;