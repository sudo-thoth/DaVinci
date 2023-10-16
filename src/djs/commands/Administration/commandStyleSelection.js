const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const createEmbed = require("../../functions/create/createEmbed.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("commandStyleSelection")
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
  async execute(interaction) {
    const { options } = interaction;
    const style = options.getString("style");

    // call the command style selection function
    try {
      return await commandStyleSelection(style, "slash", interaction);
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
