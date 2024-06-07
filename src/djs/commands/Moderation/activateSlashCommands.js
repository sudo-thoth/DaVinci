const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const createEmbed = require("../../functions/create/createEmbed.js");
const scripts = require("../../functions/scripts/scripts.js");
const { activateSlashCommands } = require("../../functions/prefixCommandHandling/commandCenter.js");


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
    "activate-slash-commands",
    "activateslashcommands",
    "slashcommandson",
    "slashcommands",
    "slashcommand",

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
      // defer the reply to the interaction
      try {
        await interaction.deferReply();
        deferred = true;
    } catch (error) {

        const errEmbed = createEmbed({
            title: `Unable to Activate Slash Commands`,
            description: `${djsEmojis.crossmark} I was unable to defer the reply to the interaction from ${trigger?.user || "*Unknown*"}.`,
            color: scripts.getErrorColor(),
            footer: {
                text: client.user.displayName,
                iconURL: client.user.displayAvatarURL()
            }
          });

        try {
             let r = await scripts_djs.send({ // send an error message using an error message function
                trigger,
                triggerType: scripts_djs.getTriggerType(failed),
                triggerUser: trigger?.user,
                messageObject: { embeds: [errEmbed] },
                deferred,
                failed
                });
                failed = r?.failed || failed;
  deferred = failed ? false : deferred;
  trigger = r?.trigger || trigger;
                return;

                
        } catch (error) {
            console.log(error, `Failed Negative Ban Message Attempt`);
        }

    }
      // call the command function
      return await activateSlashCommands("both", "prefix", interaction, interaction.client.localDB[interaction.guild.name].prefix);
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
