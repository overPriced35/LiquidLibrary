import dotenv from 'dotenv';
dotenv.config();
import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import mongoose from 'mongoose';
import ms from 'ms';
import CustomCommand from './models/CustomCommand.js';
import ModPermissions from './models/ModPermissions.js';
import { registerAllCustomCommands } from './services/discordSlashCommands.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  await mongoose.connect(process.env.MONGO_URI);
  await registerAllCustomCommands();
  console.log("Slash commands registered.");
});

async function hasModPermission(guildMember, command) {
  const perms = await ModPermissions.findOne({ command });
  if (!perms || !perms.roles || perms.roles.length === 0) return false;
  return guildMember.roles.cache.some(role => perms.roles.includes(role.id));
}

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  // Check for custom commands
  const cmd = await CustomCommand.findOne({ name: interaction.commandName });
  if (cmd) {
    if (cmd.action === "Send Message" && cmd.message) {
      await interaction.reply(cmd.message);
    } else {
      await interaction.reply({ content: `Custom command: ${cmd.action} (not yet implemented)`, ephemeral: true });
    }
    return;
  }

  // Default commands
  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  } else if (interaction.commandName === "hello") {
    await interaction.reply(`Hello ${interaction.user.toString()}!`);
  } else if (interaction.commandName === "info") {
    const owner = await client.users.fetch('932469856199127111');
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("LiquidLibrary")
          .setDescription("A multipurpose Discord bot with custom commands and moderation.\n[Dashboard](https://your-dashboard-link.com)")
          .addFields(
            { name: "Owner", value: `<@932469856199127111> (${owner.tag})` }
          )
          .setColor(0xff8800)
          .setFooter({ text: "Made by overpriced.mp3" })
      ]
    });
  } else if (["kick", "ban", "mute", "warn"].includes(interaction.commandName)) {
    if (!interaction.guild) return interaction.reply({ content: "Server only.", ephemeral: true });
    const member = await interaction.guild.members.fetch(interaction.user.id);
    const hasPerm = await hasModPermission(member, interaction.commandName);
    if (!hasPerm) return interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });

    const targetUser = interaction.options.getUser('user');
    const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
    const reason = interaction.options.getString('reason') || 'No reason provided.';

    if (!targetMember) return interaction.reply({ content: "User not found.", ephemeral: true });

    if (interaction.commandName === "kick") {
      if (!targetMember.kickable) return interaction.reply({ content: "I can't kick that user.", ephemeral: true });
      await targetMember.kick(reason);
      await interaction.reply(`👢 Kicked ${targetUser.tag}. Reason: ${reason}`);
    } else if (interaction.commandName === "ban") {
      if (!targetMember.bannable) return interaction.reply({ content: "I can't ban that user.", ephemeral: true });
      await targetMember.ban({ reason });
      await interaction.reply(`🔨 Banned ${targetUser.tag}. Reason: ${reason}`);
    } else if (interaction.commandName === "mute") {
      const durationStr = interaction.options.getString('duration');
      let durationMs;
      try { durationMs = ms(durationStr); } catch { durationMs = null; }
      if (!durationMs || durationMs < 10000 || durationMs > 28 * 24 * 60 * 60 * 1000)
        return interaction.reply({ content: "Invalid duration. Example: `10m`, `1h`.", ephemeral: true });
      if (!targetMember.moderatable) return interaction.reply({ content: "I can't mute that user.", ephemeral: true });
      await targetMember.timeout(durationMs, reason);
      await interaction.reply(`🔇 Muted ${targetUser.tag} for ${durationStr}. Reason: ${reason}`);
    } else if (interaction.commandName === "warn") {
      await interaction.reply(`⚠️ Warned ${targetUser.tag}. Reason: ${reason}`);
      try { await targetUser.send(`You were warned in ${interaction.guild.name}: ${reason}`); } catch {}
    }
  }
});

client.login(process.env.DISCORD_TOKEN);