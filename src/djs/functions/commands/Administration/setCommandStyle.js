const client = require("./../../../index.js");
const createEmbed = require(".././../create/createEmbed.js");
const scripts = require("./../../scripts/scripts.js");
const slashCommandDisabler = require("../../slashCommandControl/slashCommandDisabler.js");
const slashCommandEnabler = require("../../slashCommandControl/slashCommandEnabler.js");
const scripts_djs = require("../../scripts/djs.js");
const djsEmojis = require("../../scripts/djsEmojis.js");

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

  let deferred = false;
  let failed = false;

  const currentStyle = guildObject.commandStyle;

  // check if the type is slash
  if (type === "slash") {
    // trigger is the interaction object

    // defer reply to the interaction
    try {
      await trigger.deferReply();
      deferred = true;
    } catch (error) {
      console.log(error, `Failed to Defer Reply`);
    }

    if (currentStyle === style) {
      // send error embed to the interaction user
      const errEmbed = createEmbed({
            footer: {
              text: client.user.displayName,
              iconURL: client.user.displayAvatarURL(),
            },
            title: `${djsEmojis.crossmark} **Command Style Already: ${style}**`,
        description: `> The command style is already set to \`${style} command style\` for this server.`,
        color: scripts.getErrorColor(),
      });
      try {
        return await scripts_djs.send({
          trigger,
          triggerType: "interaction",
          triggerUser: trigger?.user,
          messageObject: { embeds: [errEmbed] },
          deferred,
          failed,
        });
        
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
          title: `${djsEmojis.crossmark} **Unable to Select Command Style**`,
          description: `> I was unable to select the command style for some reason.\n> \`\`\`js\n${error}\n\`\`\``,
          color: scripts.getErrorColor(),
        });
        try {
          return await scripts_djs.send({ // send the error embed via the send function
            trigger,
            triggerType: scripts_djs.getTriggerType(failed),
            triggerUser: trigger?.user,
            messageObject: {embeds: [errEmbed]},
            deferred,
            failed
          })

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
            footer: {
              text: client.user.displayName,
              iconURL: client.user.displayAvatarURL(),
            },
            title: `${djsEmojis.crossmark} **Unable to Enable Slash Commands**`,
            description: `> I was unable to enable slash commands for some reason.\n> \`\`\`js\n${error}\n\`\`\``,
            color: scripts.getErrorColor(),
          });
          try {
           let r = await scripts_djs.send({ // send the error embed via the send function
              trigger,
              triggerType: scripts_djs.getTriggerType(failed),
              triggerUser: trigger?.user,
              messageObject: {embeds: [errEmbed]},
              deferred,
              failed
            })

            failed = r?.failed || failed;
            deferred = failed ? false : deferred;
            trigger = r?.trigger || trigger;

          } catch (error) {
            console.log(
              error,
              `Failed Negative Command Style Selection Message Attempt`
            );
          }
      }

      // send success embed to the interaction user
      const successEmbed = createEmbed({
            footer: {
              text: client.user.displayName,
              iconURL: client.user.displayAvatarURL(),
            },
            title: `${djsEmojis.checkmark} **Command Style Set to Slash**`,
        description: `> The command style has been set to \`slash command style\` for this server.`,
        color: scripts.getSuccessColor(),
      });
      try {
        return await scripts_djs.send({ // send the success embed via the send function
          trigger,
          triggerType: scripts_djs.getTriggerType(failed),
          triggerUser: trigger?.user,
          messageObject: {embeds: [successEmbed]},
          deferred,
          failed
        })

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
          title: `${djsEmojis.crossmark} **Unable to Select Command Style**`,
          description: `> I was unable to select the command style for some reason.\n> \`\`\`js\n${error}\n\`\`\``,
          color: scripts.getErrorColor(),
          footer: {
            text: client.user.displayName,
            iconURL: client.user.displayAvatarURL(),
          },
        });
        try {
          return await scripts_djs.send({ // send the error embed via the send function
            trigger,
            triggerType: scripts_djs.getTriggerType(failed),
            triggerUser: trigger?.user,
            messageObject: {embeds: [errEmbed]},
            deferred,
            failed
          })

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
          title: `${djsEmojis.crossmark} **Unable to Disable Slash Commands**`,
          description: `> I was unable to disable slash commands for some reason.\n> \`\`\`js\n${error}\n\`\`\``,
          color: scripts.getErrorColor(),
        });
        try {
         let r = await scripts_djs.send({ // send the error embed via the send function
            trigger,
            triggerType: scripts_djs.getTriggerType(failed),
            triggerUser: trigger?.user,
            messageObject: {embeds: [errEmbed]},
            deferred,
            failed
          })
          failed = r?.failed || failed;
          deferred = failed ? false : deferred;
          trigger = r?.trigger || trigger;

        } catch (error) {
          console.log(
            error,
            `Failed Negative Command Style Selection Message Attempt`
          );
        }
      }

      // send success embed to the interaction user
      const successEmbed = createEmbed({
            footer: {
              text: client.user.displayName,
              iconURL: client.user.displayAvatarURL(),
            },
            title: `${djsEmojis.checkmark} **Command Style Set to Prefix**`,
        description: `> The command style has been set to \`prefix command style\` for this server.\n> Current Prefix: \`${prefix}\``,
        color: scripts.getSuccessColor(),
      });
      try {
        return await scripts_djs.send({ // send the success embed via the send function 
          trigger,
          triggerType: scripts_djs.getTriggerType(failed),
          triggerUser: trigger?.user,
          messageObject: {embeds: [successEmbed]},
          deferred,
          failed
        })

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
          title: `${djsEmojis.crossmark} **Unable to Select Command Style**`,
          description: `> I was unable to select the command style for some reason.\n> \`\`\`js\n${error}\n\`\`\``,
          color: scripts.getErrorColor(),
          footer: {
            text: client.user.displayName,
            iconURL: client.user.displayAvatarURL(),
          },
        });
        try {
          return await scripts_djs.send({ // send the error embed via the send function 
            trigger,
            triggerType: scripts_djs.getTriggerType(failed),
            triggerUser: trigger?.user,
            messageObject: {embeds: [errEmbed]},
            deferred,
            failed
          })

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
            footer: {
              text: client.user.displayName,
              iconURL: client.user.displayAvatarURL(),
            },
            title: `${djsEmojis.crossmark} **Unable to Enable Slash Commands**`,
            description: `> I was unable to enable slash commands for some reason.\n> \`\`\`js\n${error}\n\`\`\``,
            color: scripts.getErrorColor(),
          });
          try {
            let r = await scripts_djs.send({ // send the error embed via the send function 
                trigger,
                triggerType: scripts_djs.getTriggerType(failed),
                triggerUser: trigger?.user,
                messageObject: {embeds: [errEmbed]},
                deferred,
                failed
              })
            failed = r?.failed || failed;
            deferred = failed ? false : deferred;
            trigger = r?.trigger || trigger;

          } catch (error) {
            console.log(
              error,
              `Failed Negative Command Style Selection Message Attempt`
            );
          }
        }
      }

      // send success embed to the interaction user
      const successEmbed = createEmbed({
            footer: {
              text: client.user.displayName,
              iconURL: client.user.displayAvatarURL(),
            },
            title: `${djsEmojis.checkmark} **Command Style Set to Both**`,
        description: `> The command style has been set to \`both command styles\` for this server.\n> Current Prefix: \`${prefix}\``,
        color: scripts.getSuccessColor(),
      });
      try {
        return await scripts_djs.send({ // send the success embed via the send function
          trigger,
          triggerType: scripts_djs.getTriggerType(failed),
          triggerUser: trigger?.user,
          messageObject: {embeds: [successEmbed]},
          deferred,
          failed
        })

      } catch (error) {
        console.log(
          error,
          `Failed Positive Command Style Selection Message Attempt`
        );
      }
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
            footer: {
              text: client.user.displayName,
              iconURL: client.user.displayAvatarURL(),
            },
            title: `${djsEmojis.crossmark} **Invalid Command Style**`,
        description: `> The command style must be \`slash\`, \`prefix\`, or \`both\`.`,
        color: scripts.getErrorColor(),
      });
      try {
        return await scripts_djs.send({ // send the error embed via the send function
          trigger,
          triggerType: scripts_djs.getTriggerType(failed),
          triggerUser: trigger?.user,
          messageObject: {embeds: [errEmbed]},
          deferred,
          failed
        })

      } catch (error) {
        console.log(
          error,
          `Failed Negative Command Style Selection Message Attempt`
        );
      }
    }

    if (currentStyle === style) {
      // send error embed to the interaction user
      const errEmbed = createEmbed({
            footer: {
              text: client.user.displayName,
              iconURL: client.user.displayAvatarURL(),
            },
            title: `${djsEmojis.crossmark} **Command Style Already: ${style}**`,
        description: `> The command style is already set to \`${style} command style\` for this server.`,
        color: scripts.getErrorColor(),
      });
      try {
        return await scripts_djs.send({ // send the error embed via the send function
          trigger,
          triggerType: scripts_djs.getTriggerType(failed),
          triggerUser: trigger?.user,
          messageObject: {embeds: [errEmbed]},
          deferred,
          failed
        })

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
          title: `${djsEmojis.crossmark} **Unable to Select Command Style**`,
          description: `> I was unable to select the command style for some reason.\n> \`\`\`js\n${error}\n\`\`\``,
          color: scripts.getErrorColor(),
        });
        try {
          return await scripts_djs.send({ // send the error embed via the send function
            trigger,
            triggerType: scripts_djs.getTriggerType(failed),
            triggerUser: trigger?.user,
            messageObject: {embeds: [errEmbed]},
            deferred,
            failed
          })

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
          await slashCommandEnabler(client, trigger.guild); // trigger slash command enabler
        } catch (error) {
          console.log(error, `Failed to Enable Slash Commands`);
          // send message to the interaction user stating, was unable to complete the command
          const errEmbed = createEmbed({
            footer: {
              text: client.user.displayName,
              iconURL: client.user.displayAvatarURL(),
            },
            title: `${djsEmojis.crossmark} **Unable to Enable Slash Commands**`,
            description: `> I was unable to enable slash commands for some reason.\n> \`\`\`js\n${error}\n\`\`\``,
            color: scripts.getErrorColor(),
          });
          try {
            let r = await scripts_djs.send({ // send the error embed via the send function
                trigger,
                triggerType: scripts_djs.getTriggerType(failed),
                triggerUser: trigger?.user,
                messageObject: {embeds: [errEmbed]},
                deferred,
                failed
              })
            failed = r?.failed || failed;
            deferred = failed ? false : deferred;
            trigger = r?.trigger || trigger;
            
          } catch (error) {
            console.log(
              error,
              `Failed Negative Command Style Selection Message Attempt`
            );
          }
        }
      }

      // send success embed to the interaction user
      const successEmbed = createEmbed({
            footer: {
              text: client.user.displayName,
              iconURL: client.user.displayAvatarURL(),
            },
            title: `${djsEmojis.checkmark} **Command Style Set to Slash**`,
        description: `> The command style has been set to \`slash command style\` for this server.`,
        color: scripts.getSuccessColor(),
      });
      try {
        return await scripts_djs.send({ // send the success embed via the send function
          trigger,
          triggerType: scripts_djs.getTriggerType(failed),
          triggerUser: trigger?.user,
          messageObject: {embeds: [successEmbed]},
          deferred,
          failed
        })

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
          title: `${djsEmojis.crossmark} **Unable to Select Command Style**`,
          description: `> I was unable to select the command style for some reason.\n> \`\`\`js\n${error}\n\`\`\``,
          color: scripts.getErrorColor(),
        });
        try {
          return await scripts_djs.send({ // send the error embed via the send function
            trigger,
            triggerType: scripts_djs.getTriggerType(failed),
            triggerUser: trigger?.user,
            messageObject: {embeds: [errEmbed]},
            deferred,
            failed
          })

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
          title: `${djsEmojis.crossmark} **Unable to Disable Slash Commands**`,
          description: `> I was unable to disable slash commands for some reason.\n> \`\`\`js\n${error}\n\`\`\``,
          color: scripts.getErrorColor(),
        });
        try {
          let r = await scripts_djs.send({ // send the error embed via the send function
              trigger,
              triggerType: scripts_djs.getTriggerType(failed),
              triggerUser: trigger?.user,
              messageObject: {embeds: [errEmbed]},
              deferred,
              failed
            })
          failed = r?.failed || failed;
          deferred = failed ? false : deferred;
          trigger = r?.trigger || trigger;

        } catch (error) {
          console.log(
            error,
            `Failed Negative Command Style Selection Message Attempt`
          );
        }
      }

      // send success embed to the interaction user
      const successEmbed = createEmbed({
            footer: {
              text: client.user.displayName,
              iconURL: client.user.displayAvatarURL(),
            },
            title: `${djsEmojis.checkmark} **Command Style Set to Prefix**`,
        description: `> The command style has been set to \`prefix command style\` for this server.\n> Current Prefix: \`${prefix}\``,
        color: scripts.getSuccessColor(),
      });

      try {
        return await scripts_djs.send({ // send the success embed via the send function
          trigger,
          triggerType: scripts_djs.getTriggerType(failed),
          triggerUser: trigger?.user,
          messageObject: {embeds: [successEmbed]},
          deferred,
          failed
        })

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
          title: `${djsEmojis.crossmark} **Unable to Select Command Style**`,
          description: `> I was unable to select the command style for some reason.\n> \`\`\`js\n${error}\n\`\`\``,
          color: scripts.getErrorColor(),
        });
        try {
          return await scripts_djs.send({ // send the error embed via the send function
            trigger,
            triggerType: scripts_djs.getTriggerType(failed),
            triggerUser: trigger?.user,
            messageObject: {embeds: [errEmbed]},
            deferred,
            failed
          })

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
            footer: {
              text: client.user.displayName,
              iconURL: client.user.displayAvatarURL(),
            },
            title: `${djsEmojis.crossmark} **Unable to Enable Slash Commands**`,
            description: `> I was unable to enable slash commands for some reason.\n> \`\`\`js\n${error}\n\`\`\``,
            color: scripts.getErrorColor(),
          });
          try {
            let r = await scripts_djs.send({ // send the error embed via the send function
                trigger,
                triggerType: scripts_djs.getTriggerType(failed),
                triggerUser: trigger?.user,
                messageObject: {embeds: [errEmbed]},
                deferred,
                failed
              })
            failed = r?.failed || failed;
            deferred = failed ? false : deferred;
            trigger = r?.trigger || trigger;
          } catch (error) {
            console.log(
              error,
              `Failed Negative Command Style Selection Message Attempt`
            );
          }
        }
      }

      // send success embed to the interaction user
      const successEmbed = createEmbed({
            footer: {
              text: client.user.displayName,
              iconURL: client.user.displayAvatarURL(),
            },
            title: `${djsEmojis.checkmark} **Command Style Set to Both**`,
        description: `> The command style has been set to \`both command styles\` for this server.\n> Current Prefix: \`${prefix}\``,
        color: scripts.getSuccessColor(),
      });
      try {
        return await scripts_djs.send({ // send the success embed via the send function
          trigger,
          triggerType: scripts_djs.getTriggerType(failed),
          triggerUser: trigger?.user,
          messageObject: {embeds: [successEmbed]},
          deferred,
          failed
        })
      } catch (error) {
        console.log(
          error,
          `Failed Positive Command Style Selection Message Attempt`
        );
      }
    }
  }

}

module.exports = setCommandStyle;
