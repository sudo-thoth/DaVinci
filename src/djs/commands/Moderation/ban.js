const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const createEmbed = require("../../functions/create/createEmbed.js");
const ban = require("../../functions/commands/Moderation/ban.js");
const scripts = require("../../functions/scripts/scripts.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user from the discord server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("User to be kicked.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("type").setDescription("Type of ban. Default: Standard")
      .setRequired(false)
      .addChoices(
        {name: "Standard", value: "standard"},
        {name: "Soft", value: "soft"},
        {name: "Hard", value: "hard"},
        {name: "PermaBan", value: "permaban"},
      )
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason for the ban.")
      .required(false)
    ),
  about: "Allows the user to ban a member from the server. The ban can be a standard ban, soft ban, hard ban, or permaban. Standard: Ban the user from the server. Soft: Ban the user then an immediate unBan. Hard: Ban the user and delete their messages. PermaBan: Ban, add the user to the permanent ban list, and delete their messages.",
  sudo: [
    "ban",
    "banUser",
    "banMember",
    "banMemberFromServer",
    "banMemberFromDiscord",
    "banUserFromServer",
    "banUserFromDiscord",
    "softBan",
    "sBan",
    "softBanUser",
    "softBanMember",
    "softBanMemberFromServer",
    "softBanMemberFromDiscord",
    "softBanUserFromServer",
    "softBanUserFromDiscord",
    "hardBan",
    "hBan",
    "hardBanUser",
    "hardBanMember",
    "hardBanMemberFromServer",
    "hardBanMemberFromDiscord",
    "hardBanUserFromServer",
    "hardBanUserFromDiscord",
    "permaban",
    "pBan",
    "permabanUser",
    "permabanMember",
    "permabanMemberFromServer",
    "permabanMemberFromDiscord",
    "permabanUserFromServer",
    "permabanUserFromDiscord",
    "permanentBan",
  ],
  prefix_format: "<prefix>(ban, softBan, hardBan, permaBan) <user> <reason>",
  arguments: [
    "user: The user to ban.",
    "reason: The reason for the ban.",
  ],
  prefix_example: ",ban @user#0000 || ,softBan @user#0000 spamming",
  permissions: ["BanMembers"],
  async execute(interaction) {
    const { options } = interaction;
    const user = options.getUser("target");
    const category = options.getString("type") ||  "standard";
    const reason = options.getString("reason") ||  "No reason provided.";
    try {
        // call the command function
      return await ban(user, category, reason, "slash", interaction);
    } catch (error) {
      console.log(error, `Ban Request Failed`);
      // send error embed to the interaction user
      const errEmbed = createEmbed({
        title: `Unable to Ban`,
        description: `❌ \`type: ${category}\`\nI was unable to ban ${user} for some reason.\n\`\`\`js\n${error}\n\`\`\``,
        color: scripts.getErrorColor(),
      });
      try {
        return await interaction.reply({ embeds: [errEmbed] });
      } catch (error) {
        console.log(error, `Failed Negative Ban Message Attempt`);
      }
    }
  },
};
