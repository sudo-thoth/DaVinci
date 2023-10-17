const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const createEmbed = require("../../functions/create/createEmbed.js");
const setCommandStyle = require("../../functions/commands/Administration/setCommandStyle.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setCommandStyle")
    .setDescription("Choose command style to activate, slash, prefix or both.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("style")
        .setDescription("slash or prefix.")
        .addChoices(
          { name: "Both", value: "both" },
          { name: "Slash", value: "slash" },
          { name: "Prefix", value: "prefix" }
        )
        .setRequired(true)
    ),
    about: "Allows the user to select the style of command activation in a server. Options being Slash Commands, Prefix Commands, or Both Slash & Prefix Commands.",
    sudo:["commandStyle", "commandStyleSelection", "commandStyleSelect", "commandStyleSelecting", "commandStyleSelects", "styleCommand", "styleCommandSelection", "styleCommandSelect", "styleCommandSelecting", "styleCommandSelects", "selectCommandStyle", "setCommandStyle", "setCommandStyleSelection", "setCommandStyleSelect", "setCommandStyleSelecting", "setCommandStyleSelects", "selectStyleCommand"],
    prefix_format: "<prefix>setCommandStyle <style [both, slash, prefix]> <prefix (if style = prefix or both)>",
    prefix_example: "!setCommandStyle prefix ,",
    permissions: ["Administrator"],
  async execute(interaction) {
    const { options } = interaction;
    const style = options.getString("style");

    // call the command style selection function
    try {
      return await setCommandStyle(style, "slash", interaction);
    } catch (error) {
      console.log(error, `Command Style Selection Request Failed`);
      // send error embed to the interaction user
      const errEmbed = createEmbed({
        title: `Unable to Select Command Style`,
        description: `❌ I was unable to select the command style for some reason.\n\`\`\`js\n${error}\n\`\`\``,
        color: scripts.getErrorColor(),
      });
      try {
        return await interaction.reply({ embeds: [errEmbed] });
      } catch (error) {
        console.log(
          error,
          `Failed Negative Command Style Selection Message Attempt`
        );
      }
    }
  },
};
