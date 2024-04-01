const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const createEmbed = require("../../functions/create/createEmbed.js");
const kick = require("../../functions/commands/Moderation/kick.js");
const scripts = require("../../functions/scripts/scripts.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("activate-slashcommands")
    .setDescription("Server Currently in Prefix Only Mode: Activates the slash commands")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  about: " Activates the slash commands [Command Only Accessible during Prefix Only Mode]",
  sudo: [
    "activate-slashcommands",
    "activate-slashcommand",
    "activate-slash",
    "slashcommands-activate",
    "slashcommands-on",
    "slashcommands-enable",
    "enable slashcommands",
    "on/",
    "activate/",
    "enable/",
    "slash-on",
    "slash-activate",
    "slash-enable",
    "slashon",
    "slashactivate",
    "slashenable",
    "slash/"
  ],
  prefix_format: "<prefix><command (sudo)>",
  arguments: [],
  prefix_example: ",activate/",
  permissions: ["ManageGuild"],
  async execute(interaction) {
  
    // call the command style selection function
    try {
      // call the command function
      return await setCommandStyle("both", "prefix", interaction);
    } catch (error) {
      console.log(error, `Kick Request Failed`);
      // send error embed to the interaction user
      const errEmbed = createEmbed({
        title: `Unable to Kick`,
        description: `❌ I was unable to kick ${user} for some reason.\n\`\`\`js\n${error}\n\`\`\``,
        color: scripts.getErrorColor(),
          footer: {
            text: interaction.client.user.displayName,
            iconURL: interaction.client.user.displayAvatarURL()
          }
      });
      try {
        return await interaction.reply({ embeds: [errEmbed] });
      } catch (error) {
        console.log(error, `Failed Negative Kick Message Attempt`);
      }
    }
  },
};
