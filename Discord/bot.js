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
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
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

  // Try to find a custom command (either global or per guild)
  const dbCmd = await CustomCommand.findOne({
    $or: [
      { name: interaction.commandName },
      { guildId: interaction.guildId, name: interaction.commandName }
    ]
  });

  if (dbCmd) {
    // Handle custom command actions
    try {
      switch (dbCmd.action) {
        case "Send Message":
        case "send_message":
          await interaction.reply(dbCmd.message || dbCmd.content || "No content set.");
          break;
        case "send_dm":
          await interaction.user.send(dbCmd.content || "No content set.");
          await interaction.reply({ content: "DM sent!", ephemeral: true });
          break;
        case "send_channel":
          if (!dbCmd.channel) return interaction.reply({ content: "Channel not set.", ephemeral: true });
          const channel = await client.channels.fetch(dbCmd.channel);
          await channel.send(dbCmd.content || "No content set.");
          await interaction.reply({ content: "Message sent to channel!", ephemeral: true });
          break;
        case "set_roles":
        case "give_roles":
        case "add_roles":
          {
            const user = interaction.options.getUser("user");
            const member = await interaction.guild.members.fetch(user.id);
            const roles = (dbCmd.roles || []).filter(Boolean);
            if (!roles.length) return interaction.reply({ content: "No roles set.", ephemeral: true });
            await member.roles.add(roles);
            await interaction.reply({ content: `Roles updated for ${user.tag}.`, ephemeral: true });
          }
          break;
        case "remove_roles":
          {
            const user = interaction.options.getUser("user");
            const member = await interaction.guild.members.fetch(user.id);
            const roles = (dbCmd.roles || []).filter(Boolean);
            if (!roles.length) return interaction.reply({ content: "No roles set.", ephemeral: true });
            await member.roles.remove(roles);
            await interaction.reply({ content: `Roles removed from ${user.tag}.`, ephemeral: true });
          }
          break;
        default:
          await interaction.reply({ content: "Action not implemented.", ephemeral: true });
      }
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: "Error executing command.", ephemeral: true });
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
          .setTitle("Dewey Bot")
          .setDescription("A multipurpose Discord bot with custom commands and moderation.\n[Dashboard](https://deweybot.com)")
          .addFields(
            { name: "Team", value: `<@932469856199127111> (${owner.tag})` }
          )
          .setColor(0xff8800)
          .setFooter({ text: "Made with love and code by overpriced.mp3" })
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