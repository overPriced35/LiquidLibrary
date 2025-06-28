import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import { Client, GatewayIntentBits, Partials, REST } from "discord.js";

// Check required env variables
const { DISCORD_TOKEN, CLIENT_ID, MONGODB_URI, PORT } = process.env;
if (!DISCORD_TOKEN) throw new Error("Missing DISCORD_TOKEN in .env");
if (!CLIENT_ID) throw new Error("Missing CLIENT_ID in .env");
if (!MONGODB_URI) throw new Error("Missing MONGODB_URI in .env");

// --- Discord.js setup ---
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel],
});

const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

client.once("ready", () => {
  console.log(`Discord bot logged in as ${client.user.tag}`);
});

// Example event handler (customize as needed)
client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  if (message.content === "!ping") {
    message.reply("Pong!");
  }
});

// --- Express setup ---
const app = express();
app.use(express.json());

// Example route
app.get("/", (req, res) => {
  res.send("API server is running!");
});

// --- MongoDB connection ---
mongoose.connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });

// --- Start Express server ---
const port = PORT || 3001;
app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});

// --- Login Discord Bot ---
client.login(process.env.DISCORD_TOKEN)
  .then(() => console.log("Discord client logged in!"))
  .catch(err => {
    console.error("Discord client failed to login:", err);
    process.exit(1);
  });