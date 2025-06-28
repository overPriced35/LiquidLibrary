import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

// Pull env vars
const { DISCORD_TOKEN, CLIENT_ID, DISCORD_GUILD_ID } = process.env;
if (!DISCORD_TOKEN) throw new Error("Missing DISCORD_TOKEN in .env");
if (!CLIENT_ID) throw new Error("Missing CLIENT_ID in .env");
if (!DISCORD_GUILD_ID) throw new Error("Missing DISCORD_GUILD_ID in .env");

// Define all slash commands (edit as needed)
const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
    type: 1
  },
  {
    name: "hello",
    description: "Says hello and tags you.",
    type: 1
  },
  {
    name: "info",
    description: "Shows bot info and team.",
    type: 1
  },
  {
    name: "kick",
    description: "Kick a user from the server.",
    type: 1,
    options: [
      {
        name: "user",
        description: "User to kick",
        type: 6, // USER
        required: true
      },
      {
        name: "reason",
        description: "Reason",
        type: 3, // STRING
        required: false
      }
    ]
  },
  {
    name: "ban",
    description: "Ban a user from the server.",
    type: 1,
    options: [
      {
        name: "user",
        description: "User to ban",
        type: 6,
        required: true
      },
      {
        name: "reason",
        description: "Reason",
        type: 3,
        required: false
      }
    ]
  },
  {
    name: "mute",
    description: "Mute (timeout) a user for a duration.",
    type: 1,
    options: [
      {
        name: "user",
        description: "User to mute",
        type: 6,
        required: true
      },
      {
        name: "duration",
        description: "Duration (e.g. 10m, 1h)",
        type: 3,
        required: true
      },
      {
        name: "reason",
        description: "Reason",
        type: 3,
        required: false
      }
    ]
  },
  {
    name: "warn",
    description: "Warn a user.",
    type: 1,
    options: [
      {
        name: "user",
        description: "User to warn",
        type: 6,
        required: true
      },
      {
        name: "reason",
        description: "Reason",
        type: 3,
        required: false
      }
    ]
  }
];

// Slash command registration function
export async function registerAllCustomCommands() {
  const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);
  try {
    console.log("Registering slash commands for guild:", DISCORD_GUILD_ID);
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, DISCORD_GUILD_ID),
      { body: commands }
    );
    console.log("Slash commands registered successfully.");
  } catch (error) {
    console.error("Failed to register slash commands:", error);
    throw error;
  }
}