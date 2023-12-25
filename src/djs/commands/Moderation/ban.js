const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const createEmbed = require("../../functions/create/createEmbed.js");
const ban = require("../../functions/commands/Moderation/ban.js");
const scripts = require("../../functions/scripts/scripts.js");
const scripts_djs = require("../../functions/scripts/scripts_djs.js");

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
        {name: "Soft - Unban Immediately", value: "soft"},
        {name: "Hard - Delete Messages", value: "hard"},
        {name: "PermaBan - Add to PermaBan List", value: "permaban"},
      )
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason for the ban.")
      
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
    const { options, client } = interaction;
    const user = options.getUser("target");
    const category = options.getString("type") ||  "standard";
    const reason = options.getString("reason") ||  "No reason provided.";

    // call the command function
    try {      
      return await ban(user, category, reason, "slash", interaction);
    } catch (error) {
      console.log(error, `Ban Request Failed`);

      // send error embed to the interaction user
      let errEmbed = createEmbed({
        title: `❌ **Unable to Ban**`,
        description: `> \`ban type: ${category}\`\n> I was unable to ban ${user} for some reason.\n> \`\`\`js\n${error}\n\`\`\``,
        color: scripts.getErrorColor(),
      });

      if (error.message === "Unknown Member") {
        if(category === "permaban") { // if the user is not in the server & the category is permaban, then continue
          return await ban(user, category, reason, "slash", interaction);
        }
        // if category is not permaban, then modify the error embed
        errEmbed = createEmbed({
          title: `❌ Unable to Ban`,
          description: `> \`ban type: ${category}\`\n> I was unable to ban ${user} because they are not a member of the server.`,
          color: scripts.getErrorColor(),
          footer: {
            text: client.user.displayName,
            iconURL: client.user.displayAvatarURL(),
          }
        });

      } 
      try {
        return await scripts_djs.send({ // send the error embed via the send function
          trigger: interaction,
          triggerType: "interaction",
          triggerUser: interaction?.user,
          messageObject: {embeds: [errEmbed]},
          deferred: true,
        })
      } catch (error) {
        console.log(error, `Failed Negative Ban Message Attempt`);

        // send error via error function
        try{
          return await scripts_djs.sendError({
            error,
            errorView: "short",
            trigger: interaction,
            triggerType: "interaction",
            triggerUser: interaction?.user,
            commandName: `${category} ban`,
            action: "running ban command",
            deferred: true,
          });
        } catch (error) {
          console.log(error, `Failed Error Function`);
        }
    }
  }
  },
};
