import dotenv from 'dotenv';
dotenv.config();
import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import CustomCommand from '../models/CustomCommand.js';

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;

const rest = new REST({ version: '10' }).setToken(token);

export async function registerAllCustomCommands() {
  const commands = await CustomCommand.find();
  const slashDefs = commands.map(cmd => {
    const slash = new SlashCommandBuilder()
      .setName(cmd.name.toLowerCase())
      .setDescription(`Custom command: ${cmd.action}`);
    if (cmd.action === "Send Message") {
      slash.addStringOption(option =>
        option.setName("message")
          .setDescription("Custom message")
          .setRequired(false)
      );
    }
    return slash.toJSON();
  });
  await rest.put(
    Routes.applicationGuildCommands(clientId, guildId),
    { body: [...slashDefs, ...defaultSlashCommands()] }
  );
}

export async function registerCustomCommand(cmd) {
  const slash = new SlashCommandBuilder()
    .setName(cmd.name.toLowerCase())
    .setDescription(`Custom command: ${cmd.action}`);
  if (cmd.action === "Send Message") {
    slash.addStringOption(option =>
      option.setName("message")
        .setDescription("Custom message")
        .setRequired(false)
    );
  }
  await rest.post(
    Routes.applicationGuildCommands(clientId, guildId),
    { body: [slash.toJSON()] }
  );
}

export async function deleteCustomCommand(cmd) {
  const commands = await rest.get(Routes.applicationGuildCommands(clientId, guildId));
  const target = commands.find(c => c.name === cmd.name.toLowerCase());
  if (target) {
    await rest.delete(Routes.applicationGuildCommand(clientId, guildId, target.id));
  }
}

export function defaultSlashCommands() {
  return [
    new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Replies with Pong!')
      .toJSON(),
    new SlashCommandBuilder()
      .setName('hello')
      .setDescription('Says hello and tags you.')
      .toJSON(),
    new SlashCommandBuilder()
      .setName('info')
      .setDescription('Shows bot info and team.')
      .toJSON(),
    new SlashCommandBuilder()
      .setName('kick')
      .setDescription('Kick a user from the server.')
      .addUserOption(opt => opt.setName('user').setDescription('User to kick').setRequired(true))
      .addStringOption(opt => opt.setName('reason').setDescription('Reason').setRequired(false))
      .toJSON(),
    new SlashCommandBuilder()
      .setName('ban')
      .setDescription('Ban a user from the server.')
      .addUserOption(opt => opt.setName('user').setDescription('User to ban').setRequired(true))
      .addStringOption(opt => opt.setName('reason').setDescription('Reason').setRequired(false))
      .toJSON(),
    new SlashCommandBuilder()
      .setName('mute')
      .setDescription('Mute (timeout) a user for a duration.')
      .addUserOption(opt => opt.setName('user').setDescription('User to mute').setRequired(true))
      .addStringOption(opt => opt.setName('duration').setDescription('Duration (e.g. 10m, 1h)').setRequired(true))
      .addStringOption(opt => opt.setName('reason').setDescription('Reason').setRequired(false))
      .toJSON(),
    new SlashCommandBuilder()
      .setName('warn')
      .setDescription('Warn a user.')
      .addUserOption(opt => opt.setName('user').setDescription('User to warn').setRequired(true))
      .addStringOption(opt => opt.setName('reason').setDescription('Reason').setRequired(false))
      .toJSON()
  ];
}