const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const createEmbed = require("../../functions/create/createEmbed.js");
const setCommandStyle = require("../../functions/commands/Administration/setCommandStyle.js");
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
      console.log(error, `Activate Slash Commands Request Failed`);
      // send error embed to the interaction user
      const errEmbed = createEmbed({
        title: `Unable to Activate Slash Commands`,
        description: `❌ I was unable to Activate Slash Commands ${user} for some reason.\n\`\`\`js\n${error}\n\`\`\``,
        color: scripts.getErrorColor(),
          footer: {
            text: interaction.client.user.displayName,
            iconURL: interaction.client.user.displayAvatarURL()
          }
      });
      try {
        return await interaction.reply({ embeds: [errEmbed] });
      } catch (error) {
        console.log(error, `Failed Negative Activate Slash Commands Message Attempt`);
      }
    }
  },
};
