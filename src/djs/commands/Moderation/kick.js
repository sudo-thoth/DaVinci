const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const createEmbed = require("../../functions/create/createEmbed.js");
const kick = require("../../functions/commands/Moderation/kick.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user from the discord server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((option) =>
      option
        .setName("target")
        .setDescription("User to be kicked.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason for the kick.")
    ),
  async execute(interaction) {
    const { options } = interaction;
    const user = options.getUser("target");
    const reason = options.getString("reason")
      ? options.getString("reason")
      : "No reason provided.";
    try {
      return await kick(user, reason, "slash", interaction);
    } catch (error) {
      console.log(error, `Kick Request Failed`);
      // send error embed to the interaction user
      const errEmbed = createEmbed({
        title: `Unable to Kick`,
        description: `❌ I was unable to kick ${user} for some reason.\n\`\`\`js\n${error}\n\`\`\``,
        color: scripts.getErrorColor(),
      });
      try {
        return await interaction.reply({ embeds: [errEmbed] });
      } catch (error) {
        console.log(error, `Failed Negative Kick Message Attempt`);
      }
    }
  },
};
