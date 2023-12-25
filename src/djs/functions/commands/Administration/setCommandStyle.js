const client = require("./../../../index.js");
const createEmbed = require(".././../create/createEmbed.js");
const scripts = require("./../../scripts/scripts.js");
const slashCommandDisabler = require("../../slashCommandControl/slashCommandDisabler.js");
const slashCommandEnabler = require("../../slashCommandControl/slashCommandEnabler.js");

/**
 * Selects the command style (slash, prefix, or both) for a server.
 *
 * @param {string} style - The desired command style (slash, prefix, or both).
 * @param {string} type - The type of command (slash or prefix).
 * @param {Object} trigger - The interaction or message that triggered the command.
 * @param {string} prefix - The prefix for the server.
 */
async function setCommandStyle(style, type, trigger, prefix) {
  // get the guild object to get the current
  const guildObject = await client.getServer(trigger.guild);
  // if theres no prefix passed in, use the current prefix
  if (!prefix) {
    prefix = guildObject.commandPrefix;
  }

  const currentStyle = guildObject.commandStyle;

  // check if the type is slash
  if (type === "slash") {
    // trigger is the interaction object

    // defer reply to the interaction
    try {
      await trigger.deferReply();
    } catch (error) {
      console.log(error, `Failed to Defer Reply`);
    }

    if (currentStyle === style) {
      // send error embed to the interaction user
      const errEmbed = createEmbed({
        title: `Command Style Already: ${style}`,
        description: `❌ The command style is already set to \`${style} command style\` for this server.`,
        color: scripts.getErrorColor(),
      });
      try {
        return await trigger.editReply({ embeds: [errEmbed] });
      } catch (error) {
        console.log(
          error,
          `Failed Negative Command Style Selection Message Attempt`
        );
      }
    } else if (style === "slash") {
      // set the command style to slash
      guildObject.commandStyle = "slash";
      // save the updated guild object in the guilds database
      try {
        await client.guildsDB.findOneAndUpdate(
          { serverID: trigger.guild.id },
          guildObject,
          { upsert: true }
        );
      } catch (error) {
        console.log(error, `Failed to Save Updated Guild Object`);
        // send message to the interaction user stating, was unable to complete the command
        const errEmbed = createEmbed({
          title: `Unable to Select Command Style`,
          description: `❌ I was unable to select the command style for some reason.\n\`\`\`js\n${error}\n\`\`\``,
          color: scripts.getErrorColor(),
        });
        try {
          return await trigger.editReply({ embeds: [errEmbed] });
        } catch (error) {
          console.log(
            error,
            `Failed Negative Command Style Selection Message Attempt`
          );
        }
      }

      // trigger slash command enabler, if they are not already enabled with the both command style

      if (currentStyle !== "both") {
        try {
          await slashCommandEnabler(client, trigger.guild);
        } catch (error) {
          console.log(error, `Failed to Enable Slash Commands`);
          // send message to the interaction user stating, was unable to complete the command
          const errEmbed = createEmbed({
            title: `Unable to Enable Slash Commands`,
            description: `❌ I was unable to enable slash commands for some reason.\n\`\`\`js\n${error}\n\`\`\``,
            color: scripts.getErrorColor(),
          });
          try {
            await trigger.editReply({
              text: `<@${trigger.user.id}>`,
              embeds: [errEmbed],
            });
          } catch (error) {
            console.log(
              error,
              `Failed Negative Command Style Selection Message Attempt`
            );
          }
          await scripts.delay(10);
          try {
            await trigger.editReply({ text: `` });
          } catch (error) {
            console.log(error, `Failed Clear Ping in Message Attempt`);
          }
        }
      }

      // send success embed to the interaction user
      const successEmbed = createEmbed({
        title: `Command Style Set to Slash`,
        description: `✅ The command style has been set to \`slash command style\` for this server.`,
        color: scripts.getSuccessColor(),
      });
      try {
        return await trigger.editReply({ embeds: [successEmbed] });
      } catch (error) {
        console.log(
          error,
          `Failed Positive Command Style Selection Message Attempt`
        );
      }
    } else if (style === "prefix") {
      // set the command style to prefix
      guildObject.commandStyle = "prefix";
      guildObject.commandPrefix = prefix;
      // save the updated guild object in the guilds database
      try {
        await client.guildsDB.findOneAndUpdate(
          { serverID: trigger.guild.id },
          guildObject,
          { upsert: true }
        );
      } catch (error) {
        console.log(error, `Failed to Save Updated Guild Object`);
        // send message to the interaction user stating, was unable to complete the command
        const errEmbed = createEmbed({
          title: `Unable to Select Command Style`,
          description: `❌ I was unable to select the command style for some reason.\n\`\`\`js\n${error}\n\`\`\``,
          color: scripts.getErrorColor(),
        });
        try {
          return await trigger.editReply({ embeds: [errEmbed] });
        } catch (error) {
          console.log(
            error,
            `Failed Negative Command Style Selection Message Attempt`
          );
        }
      }

      // trigger slash command disabler
      try {
        await slashCommandDisabler(client, trigger.guild);
      } catch (error) {
        console.log(error, `Failed to Disable Slash Commands`);
        // send message to the interaction user stating, was unable to complete the command
        const errEmbed = createEmbed({
          title: `Unable to Disable Slash Commands`,
          description: `❌ I was unable to disable slash commands for some reason.\n\`\`\`js\n${error}\n\`\`\``,
          color: scripts.getErrorColor(),
        });
        try {
          await trigger.editReply({
            text: `<@${trigger.user.id}>`,
            embeds: [errEmbed],
          });
        } catch (error) {
          console.log(
            error,
            `Failed Negative Command Style Selection Message Attempt`
          );
        }
        await scripts.delay(10);
        try {
          await trigger.editReply({ text: `` });
        } catch (error) {
          console.log(error, `Failed Clear Ping in Message Attempt`);
        }
      }

      // send success embed to the interaction user
      const successEmbed = createEmbed({
        title: `Command Style Set to Prefix`,
        description: `✅ The command style has been set to \`prefix command style\` for this server.\nCurrent Prefix: \`${prefix}\``,
        color: scripts.getSuccessColor(),
      });
      try {
        return await trigger.editReply({ embeds: [successEmbed] });
      } catch (error) {
        console.log(
          error,
          `Failed Positive Command Style Selection Message Attempt`
        );
      }
    } else if (style === "both") {
      // set the command style to both
      guildObject.commandStyle = "both";
      guildObject.commandPrefix = prefix;
      // save the updated guild object in the guilds database
      try {
        await client.guildsDB.findOneAndUpdate(
          { serverID: trigger.guild.id },
          guildObject,
          { upsert: true }
        );
      } catch (error) {
        console.log(error, `Failed to Save Updated Guild Object`);
        // send message to the interaction user stating, was unable to complete the command
        const errEmbed = createEmbed({
          title: `Unable to Select Command Style`,
          description: `❌ I was unable to select the command style for some reason.\n\`\`\`js\n${error}\n\`\`\``,
          color: scripts.getErrorColor(),
        });
        try {
          return await trigger.editReply({ embeds: [errEmbed] });
        } catch (error) {
          console.log(
            error,
            `Failed Negative Command Style Selection Message Attempt`
          );
        }
      }

      // trigger slash command enabler, if they are not already enabled with the slash command style

      if (currentStyle !== "slash") {
        try {
          await slashCommandEnabler(client, trigger.guild);
        } catch (error) {
          console.log(error, `Failed to Enable Slash Commands`);
          // send message to the interaction user stating, was unable to complete the command
          const errEmbed = createEmbed({
            title: `Unable to Enable Slash Commands`,
            description: `❌ I was unable to enable slash commands for some reason.\n\`\`\`js\n${error}\n\`\`\``,
            color: scripts.getErrorColor(),
          });
          try {
            await trigger.editReply({
              text: `<@${trigger.user.id}>`,
              embeds: [errEmbed],
            });
          } catch (error) {
            console.log(
              error,
              `Failed Negative Command Style Selection Message Attempt`
            );
          }
          await scripts.delay(10);
          try {
            await trigger.editReply({ text: `` });
          } catch (error) {
            console.log(error, `Failed Clear Ping in Message Attempt`);
          }
        }
      }

      // send success embed to the interaction user
      const successEmbed = createEmbed({
        title: `Command Style Set to Both`,
        description: `✅ The command style has been set to \`both command styles\` for this server.\nCurrent Prefix: \`${prefix}\``,
        color: scripts.getSuccessColor(),
      });
      try {
        return await trigger.editReply({ embeds: [successEmbed] });
      } catch (error) {
        console.log(
          error,
          `Failed Positive Command Style Selection Message Attempt`
        );
      }
    }
  }
  // check if the type is prefix
  if (type === "prefix") {
    // trigger is the message object
    let replyMessage;

    // if style is not one of the valid styles, send error embed to the interaction user
    if (style !== "slash" && style !== "prefix" && style !== "both") {
      const errEmbed = createEmbed({
        title: `Invalid Command Style`,
        description: `❌ The command style must be \`slash\`, \`prefix\`, or \`both\`.`,
        color: scripts.getErrorColor(),
      });
      try {
        return await trigger.reply({ embeds: [errEmbed] });
      } catch (error) {
        console.log(
          error,
          `Failed Negative Command Style Selection Message Attempt`
        );
        try {
          return await trigger.channel.send({
            text: `<@${trigger.user.id}>`,
            embeds: [errEmbed],
          });
        } catch (error) {
          console.log(
            error,
            `Failed Negative Command Style Selection Message Attempt`
          );
        }
      }
    }

    if (currentStyle === style) {
      // send error embed to the interaction user
      const errEmbed = createEmbed({
        title: `Command Style Already: ${style}`,
        description: `❌ The command style is already set to \`${style} command style\` for this server.`,
        color: scripts.getErrorColor(),
      });
      try {
        return await trigger.reply({ embeds: [errEmbed] });
      } catch (error) {
        console.log(
          error,
          `Failed Negative Command Style Selection Message Attempt`
        );
        try {
          return await trigger.channel.send({
            text: `<@${trigger.user.id}>`,
            embeds: [errEmbed],
          });
        } catch (error) {
          console.log(
            error,
            `Failed Negative Command Style Selection Message Attempt`
          );
        }
      }
    } else if (style === "slash") {
      // set the command style to slash
      guildObject.commandStyle = "slash";
      // save the updated guild object in the guilds database
      try {
        await client.guildsDB.findOneAndUpdate(
          { serverID: trigger.guild.id },
          guildObject,
          { upsert: true }
        );
      } catch (error) {
        console.log(error, `Failed to Save Updated Guild Object`);
        // send message to the interaction user stating, was unable to complete the command
        const errEmbed = createEmbed({
          title: `Unable to Select Command Style`,
          description: `❌ I was unable to select the command style for some reason.\n\`\`\`js\n${error}\n\`\`\``,
          color: scripts.getErrorColor(),
        });
        try {
          return await trigger.reply({ embeds: [errEmbed] });
        } catch (error) {
          console.log(
            error,
            `Failed Negative Command Style Selection Message Attempt`
          );
          try {
            return await trigger.channel.send({
              text: `<@${trigger.user.id}>`,
              embeds: [errEmbed],
            });
          } catch (error) {
            console.log(
              error,
              `Failed Negative Command Style Selection Message Attempt`
            );
          }
        }
      }

      // trigger slash command enabler, if they are not already enabled with the both command style

      if (currentStyle !== "both") {
        try {
          await slashCommandEnabler(client, trigger.guild);
        } catch (error) {
          console.log(error, `Failed to Enable Slash Commands`);
          // send message to the interaction user stating, was unable to complete the command
          const errEmbed = createEmbed({
            title: `Unable to Enable Slash Commands`,
            description: `❌ I was unable to enable slash commands for some reason.\n\`\`\`js\n${error}\n\`\`\``,
            color: scripts.getErrorColor(),
          });
          try {
            replyMessage = await trigger.reply({ embeds: [errEmbed] });
          } catch (error) {
            console.log(
              error,
              `Failed Negative Command Style Selection Message Attempt`
            );
            try {
              replyMessage = await trigger.channel.send({
                text: `<@${trigger.user.id}>`,
                embeds: [errEmbed],
              });
            } catch (error) {
              console.log(
                error,
                `Failed Negative Command Style Selection Message Attempt`
              );
            }
          }
          await scripts.delay(10);
          try {
            await replyMessage.delete();
          } catch (error) {
            console.log(error, `Failed Delete Message Attempt`);
          }
        }
      }

      // send success embed to the interaction user
      const successEmbed = createEmbed({
        title: `Command Style Set to Slash`,
        description: `✅ The command style has been set to \`slash command style\` for this server.`,
        color: scripts.getSuccessColor(),
      });
      try {
        return await trigger.reply({ embeds: [successEmbed] });
      } catch (error) {
        console.log(
          error,
          `Failed Positive Command Style Selection Message Attempt`
        );
        try {
          return await trigger.channel.send({
            text: `<@${trigger.user.id}>`,
            embeds: [successEmbed],
          });
        } catch (error) {
          console.log(
            error,
            `Failed Positive Command Style Selection Message Attempt`
          );
        }
      }
    } else if (style === "prefix") {
      // set the command style to prefix
      guildObject.commandStyle = "prefix";
      guildObject.commandPrefix = prefix;
      // save the updated guild object in the guilds database
      try {
        await client.guildsDB.findOneAndUpdate(
          { serverID: trigger.guild.id },
          guildObject,
          { upsert: true }
        );
      } catch (error) {
        console.log(error, `Failed to Save Updated Guild Object`);
        // send message to the interaction user stating, was unable to complete the command
        const errEmbed = createEmbed({
          title: `Unable to Select Command Style`,
          description: `❌ I was unable to select the command style for some reason.\n\`\`\`js\n${error}\n\`\`\``,
          color: scripts.getErrorColor(),
        });
        try {
          return await trigger.reply({ embeds: [errEmbed] });
        } catch (error) {
          console.log(
            error,
            `Failed Negative Command Style Selection Message Attempt`
          );
          try {
            return await trigger.channel.send({
              text: `<@${trigger.user.id}>`,
              embeds: [errEmbed],
            });
          } catch (error) {
            console.log(
              error,
              `Failed Negative Command Style Selection Message Attempt`
            );
          }
        }
      }

      // trigger slash command disabler
      try {
        await slashCommandDisabler(client, trigger.guild);
      } catch (error) {
        console.log(error, `Failed to Disable Slash Commands`);
        // send message to the interaction user stating, was unable to complete the command
        const errEmbed = createEmbed({
          title: `Unable to Disable Slash Commands`,
          description: `❌ I was unable to disable slash commands for some reason.\n\`\`\`js\n${error}\n\`\`\``,
          color: scripts.getErrorColor(),
        });
        try {
          replyMessage = await trigger.reply({ embeds: [errEmbed] });
        } catch (error) {
          console.log(
            error,
            `Failed Negative Command Style Selection Message Attempt`
          );
          try {
            replyMessage = await trigger.channel.send({
              text: `<@${trigger.user.id}>`,
              embeds: [errEmbed],
            });
          } catch (error) {
            console.log(
              error,
              `Failed Negative Command Style Selection Message Attempt`
            );
          }
        }
        await scripts.delay(10);
        try {
          await replyMessage.delete();
        } catch (error) {
          console.log(error, `Failed Delete Message Attempt`);
        }
      }

      // send success embed to the interaction user
      const successEmbed = createEmbed({
        title: `Command Style Set to Prefix`,
        description: `✅ The command style has been set to \`prefix command style\` for this server.\nCurrent Prefix: \`${prefix}\``,
        color: scripts.getSuccessColor(),
      });

      try {
        return await trigger.reply({ embeds: [successEmbed] });
      } catch (error) {
        console.log(
          error,
          `Failed Positive Command Style Selection Message Attempt`
        );
        try {
          return await trigger.channel.send({
            text: `<@${trigger.user.id}>`,
            embeds: [successEmbed],
          });
        } catch (error) {
          console.log(
            error,
            `Failed Positive Command Style Selection Message Attempt`
          );
        }
      }
    } else if (style === "both") {
      // set the command style to both
      guildObject.commandStyle = "both";
      guildObject.commandPrefix = prefix;
      // save the updated guild object in the guilds database
      try {
        await client.guildsDB.findOneAndUpdate(
          { serverID: trigger.guild.id },
          guildObject,
          { upsert: true }
        );
      } catch (error) {
        console.log(error, `Failed to Save Updated Guild Object`);
        // send message to the interaction user stating, was unable to complete the command
        const errEmbed = createEmbed({
          title: `Unable to Select Command Style`,
          description: `❌ I was unable to select the command style for some reason.\n\`\`\`js\n${error}\n\`\`\``,
          color: scripts.getErrorColor(),
        });
        try {
          return await trigger.reply({ embeds: [errEmbed] });
        } catch (error) {
          console.log(
            error,
            `Failed Negative Command Style Selection Message Attempt`
          );
          try {
            return await trigger.channel.send({
              text: `<@${trigger.user.id}>`,
              embeds: [errEmbed],
            });
          } catch (error) {
            console.log(
              error,
              `Failed Negative Command Style Selection Message Attempt`
            );
          }
        }
      }

      // trigger slash command enabler, if they are not already enabled with the slash command style

      if (currentStyle !== "slash") {
        try {
          await slashCommandEnabler(client, trigger.guild);
        } catch (error) {
          console.log(error, `Failed to Enable Slash Commands`);
          // send message to the interaction user stating, was unable to complete the command
          const errEmbed = createEmbed({
            title: `Unable to Enable Slash Commands`,
            description: `❌ I was unable to enable slash commands for some reason.\n\`\`\`js\n${error}\n\`\`\``,
            color: scripts.getErrorColor(),
          });
          try {
            replyMessage = await trigger.reply({ embeds: [errEmbed] });
          } catch (error) {
            console.log(
              error,
              `Failed Negative Command Style Selection Message Attempt`
            );
            try {
              replyMessage = await trigger.channel.send({
                text: `<@${trigger.user.id}>`,
                embeds: [errEmbed],
              });
            } catch (error) {
              console.log(
                error,
                `Failed Negative Command Style Selection Message Attempt`
              );
            }
          }
          await scripts.delay(10);
          try {
            await replyMessage.delete();
          } catch (error) {
            console.log(error, `Failed Delete Message Attempt`);
          }
        }
      }

      // send success embed to the interaction user
      const successEmbed = createEmbed({
        title: `Command Style Set to Both`,
        description: `✅ The command style has been set to \`both command styles\` for this server.\nCurrent Prefix: \`${prefix}\``,
        color: scripts.getSuccessColor(),
      });
      try {
        return await trigger.reply({ embeds: [successEmbed] });
      } catch (error) {
        console.log(
          error,
          `Failed Positive Command Style Selection Message Attempt`
        );
        try {
          return await trigger.channel.send({
            text: `<@${trigger.user.id}>`,
            embeds: [successEmbed],
          });
        } catch (error) {
          console.log(
            error,
            `Failed Positive Command Style Selection Message Attempt`
          );
        }
      }
    }
  }
}

module.exports = setCommandStyle;
