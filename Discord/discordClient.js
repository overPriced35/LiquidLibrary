import { Client, GatewayIntentBits, REST, Routes, Partials } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

client.login(process.env.DISCORD_TOKEN);

export { client, rest };