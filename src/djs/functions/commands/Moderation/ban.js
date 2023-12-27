const djsEmojis = require("../../scripts/djsEmojis.js");
const createEmbed = require("./../../create/createEmbed.js");
const scripts = require("./../../scripts/scripts.js");
const commandCenter = require("./../../../functions/prefixCommandHandling/commandCenter.js");
const client = require("../../../index.js");
const scripts_djs = require("./../../scripts/scripts_djs.js");



// create a function that will be called when the ban command is ran.
// four different types of ban are supported: standard, soft, hard, and perma.
// standard: ban the user from the server.
// soft: ban the user then immediately unban them.
// hard: ban the user and delete their messages.
// permaban: ban the user, add them to the permanent ban list, and delete their messages.

async function ban(target, category, reason, type, trigger){
    
    let failed = false;
    let sendStatus;
    let deferred = false;
    

    // Slash Command
    if(type === "slash"){


        // defer the reply to the interaction
        try {
            await trigger.deferReply();
            deferred = true;
        } catch (error) {

            const errEmbed = createEmbed({
                title: `Unable to Ban: ${category}`,
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

        const triggerUser = trigger?.user || "*Unknown*";
        // make sure that the target is of type Object and if not then take the string input and search the guild for a member with that name or id
    if (typeof target !== "object") {
        const members = await trigger.guild.members.fetch();
        const member =
          members.find((m) => m.user.username === target) ||
          members.find((m) => m.user.id === target);
        if (!member) {
          // if the member is not found, send an error embed
          const errEmbed = createEmbed({
            title: `Unable to Ban: ${category}`,
            description: `${djsEmojis.crossmark} I couldn't find a user with the username/id of ${target}.`,
            color: scripts.getErrorColor(),
            footer: {
                text: client.user.displayName,
                iconURL: client.user.displayAvatarURL()
            }
          });
          console.log(`Ban [${category}] Request Denied: ${djsEmojis.crossmark}`);
          try {
            return await scripts_djs.send({trigger,triggerType: scripts_djs.getTriggerType(failed), triggerUser, messageObject: { embeds: [errEmbed] }, deferred, failed})
          } catch (error) {
            console.log(error, `Failed Negative Ban Message Attempt`);
          }
        }
        target = member;
      } else {
        // convert the user object to a member object
      const member = await trigger.guild.members.fetch(target);
      // if the member is not found, send an error embed
      if (!member) {
        // if the member is not found, send an error embed
        const errEmbed = createEmbed({
          title: `Unable to Ban: ${category}`,
          description: `${djsEmojis.crossmark} I couldn't find a user with the username/id of ${target}.`,
          color: scripts.getErrorColor(),
          footer: {
            text: client.user.displayName,
            iconURL: client.user.displayAvatarURL()
          }
        });
        console.log(`Ban [${category}] Request Denied: ${djsEmojis.crossmark}`);
        try {
            // send the error message via the send function
            return await scripts_djs.send({trigger,triggerType: scripts_djs.getTriggerType(failed), triggerUser, messageObject: { embeds: [errEmbed] }, deferred, failed})    
        } catch (error) {
          console.log(error, `Failed Negative Ban Message Attempt`);
        }
      }
      target = member;
      }

      // check if the bot can ban the member
        if (!target.bannable) {
            // if the member is not bannable, send an error embed
            const errEmbed = createEmbed({
            title: `Unable to Ban: ${category}`,
            description: `${djsEmojis.crossmark} I am unable to ban ${target}.`,
            color: scripts.getErrorColor(),
            footer: {
                text: client.user.displayName,
                iconURL: client.user.displayAvatarURL()
            }
            });
            console.log(`Ban [${category}] Request Denied: ${djsEmojis.crossmark}`);
            try {
            return await scripts_djs.send(trigger, "interaction", triggerUser, { embeds: [errEmbed] }, true)
            } catch (error) {
            console.log(error, `Failed Negative Ban Message Attempt`);
            }
        }

        // check if the trigger user has a lower role than the target user
        if (trigger.member.roles.highest.position <= target.roles.highest.position) {
            // if the member is not bannable, send an error embed
            const errEmbed = createEmbed({
            title: `Unable to Ban: ${category}`,
            description: `${djsEmojis.crossmark} You are unable to ban ${target}.`,
            color: scripts.getErrorColor(),
            footer: {
                text: client.user.displayName,
                iconURL: client.user.displayAvatarURL()
            }
            });
            console.log(`Ban [${category}] Request Denied: ${djsEmojis.crossmark}`);
            try {
            return await scripts_djs.send(trigger, "interaction", triggerUser, { embeds: [errEmbed] }, true)
            } catch (error) {
            console.log(error, `Failed Negative Ban Message Attempt`);
            }
        }

        
        try{
            // ban the user
            switch (category) {
              case "standard":

                // update the trigger user saying that the target is being banned
                let banStandardEmbed = createEmbed({
                  title: "Command Loading",
                  description: `> ${djsEmojis.loading_dotted} ${target} is being banned. Working on it...\n> \n> **⨀ Standard Ban:** bans the user.`,
                  color: scripts.getSuccessColor(),
                  thumbnail: target?.user?.displayAvatarURL(),
                  footer: {
                    text: client.user.displayName,
                    iconURL: client.user.displayAvatarURL(),
                  },
                });

                try {
                  let r = await scripts_djs.send({ // send the message via the send function
                    trigger,
                    triggerType: scripts_djs.getTriggerType(failed),
                    triggerUser,
                    messageObject: { embeds: [banStandardEmbed] },
                    deferred,
                    failed
                    });
                    failed = r?.failed || failed;
      deferred = failed ? false : deferred;
      trigger = r?.trigger || trigger;
                } catch (error) {
                  console.log(error, `Failed Positive Ban Message Attempt`);
                }

                try {
                  await target.ban({ reason: reason }); // ban the user
                } catch (error) {
                    // if the ban fails, send an error embed
                  banStandardEmbed = createEmbed({
                    title: `${djsEmojis.exclamationmark} **Error Banning User**`,
                    description: `> ${target} has not been banned.\n> Error:\`\`\`js\n${error}\`\`\``,
                    color: scripts.getErrorColor(),
                    footer: {
                      text: client.user.displayName,
                      iconURL: client.user.displayAvatarURL(),
                    },
                  });

                  try {
                    let r = await scripts_djs.send({ // send the error message via the send function
                        trigger,
                        triggerType: scripts_djs.getTriggerType(failed),
                        triggerUser,
                        messageObject: { embeds: [banStandardEmbed] },
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

                // update the trigger user saying that the target has been banned
                const successBanEmbed = createEmbed({
                  title: `${djsEmojis.check_badge_green} **User Banned**`,
                  description: `> ${target} has been banned.\n> \`Reason: ${reason}\``,
                  color: scripts.getSuccessColor(),
                  thumbnail: target?.user?.displayAvatarURL(),
                  footer: {
                    text: client.user.displayName,
                    iconURL: client.user.displayAvatarURL(),
                  },
                });

                try {
                  let r = await scripts_djs.send({ // send the message via the send function
                    trigger,
                    triggerType: scripts_djs.getTriggerType(failed),
                    triggerUser,
                    messageObject: { embeds: [successBanEmbed] },
                    deferred,
                    failed
                    });
                    failed = r?.failed || failed;
      deferred = failed ? false : deferred;
      trigger = r?.trigger || trigger;
                    return;
                } catch (error) {
                  console.log(error, `Failed Positive Ban Message Attempt`);
                }
                break;
              case "soft": 

                // update embed message stating that the target is being soft banned
                let banSoftEmbed = createEmbed({
                  title: "Command Loading",
                  thumbnail: target?.user?.displayAvatarURL(),
                  description: `> ${djsEmojis.loading_dotted} ${target} is being soft banned. Working on it...\n> \n> **⨀ Soft Ban:** *bans the user then immediately unbans them.*`,
                  color: scripts.getSuccessColor(),
                  footer: {
                    text: client.user.displayName,
                    iconURL: client.user.displayAvatarURL(),
                  },
                });

                // send the message to the user editing the interaction and if it fails send the message to the channel and ping the trigger user
                try {
                  let r = await scripts_djs.send({ // send the message via the send function
                    trigger,
                    triggerType: scripts_djs.getTriggerType(failed),
                    triggerUser,
                    messageObject: { embeds: [banSoftEmbed] },
                    deferred,
                    failed
                  });
                  failed = r?.failed || failed;
      deferred = failed ? false : deferred;
      trigger = r?.trigger || trigger;
                } catch (error) {
                  console.log(error, `Failed Positive Ban Message Attempt`);
                }

                try {
                  await target.ban({ reason: reason }); // ban the user
                } catch (error) {
                    // if the ban fails, send an error embed
                  banStandardEmbed = createEmbed({
                    title: `${djsEmojis.exclamationmark} **Error Banning User**`,
                    description: `> ${target} has not been banned.\n> Error:\`\`\`js\n${error}\`\`\``,
                    color: scripts.getErrorColor(),
                    footer: {
                      text: client.user.displayName,
                      iconURL: client.user.displayAvatarURL(),
                    },
                  });

                  try {
                    let r = await scripts_djs.send({ // send the error message via the send function
                        trigger,
                        triggerType: scripts_djs.getTriggerType(failed),
                        triggerUser,
                        messageObject: { embeds: [banStandardEmbed] },
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

                try {
                  await trigger.guild.members.unban(target.id); // unban the user
                } catch (error) {
                    // if the unban fails, send an error embed
                  banStandardEmbed = createEmbed({
                    title: `${djsEmojis.exclamationmark} **Error Banning User**`,
                    description: `> ${target} has not been unbanned after being banned briefly.\n> Error:\`\`\`js\n${error}\`\`\``,
                    color: scripts.getErrorColor(),
                    footer: {
                      text: client.user.displayName,
                      iconURL: client.user.displayAvatarURL(),
                    },
                  });

                  try {
                    let r = await scripts_djs.send({ // send the error message via the send function
                        trigger,
                        triggerType: scripts_djs.getTriggerType(failed),
                        triggerUser,
                        messageObject: { embeds: [banStandardEmbed] },
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

                // update the trigger user saying that the target soft ban has been completed
                banSoftEmbed = createEmbed({
                  title: `${djsEmojis.check_badge_green} **User Soft Banned**`,
                  description: `> ${target} has been soft banned.\n> ⨀ __Reason:__ \`${reason}\``,
                  color: scripts.getSuccessColor(),
                  thumbnail: target?.user?.displayAvatarURL(),
                  footer: {
                    text: client.user.displayName,
                    iconURL: client.user.displayAvatarURL(),
                  },
                });

                try {
                  let r = await scripts_djs.send({ // send the message via the send function
                    trigger,
                    triggerType: scripts_djs.getTriggerType(failed),
                    triggerUser,
                    messageObject: { embeds: [banSoftEmbed] },
                    deferred,
                    failed
                    });
                    failed = r?.failed || failed;
      deferred = failed ? false : deferred;
      trigger = r?.trigger || trigger;
                    return;
                } catch (error) {
                  console.log(error, `Failed Positive Ban Message Attempt`);
                }

                break;
              case "hard":

                // update embed
                let banHardEmbed = createEmbed({
                  title: "Command Loading",
                  thumbnail: target?.user?.displayAvatarURL(),
                  description: `> **${djsEmojis.loading_circle} ${target} is being hard banned. Working on it...** \n> \n>  **⨀ Hard Ban:** bans the user and deletes their messages.`,
                  color: scripts.getSuccessColor(),
                  footer: {
                    text: client.user.displayName,
                    iconURL: client.user.displayAvatarURL(),
                  },
                });

                // send the message to the user editing the interaction and if it fails send the message to the channel and ping the trigger user
                try {
                    let r = await scripts_djs.send({
                        trigger,
                        triggerType: scripts_djs.getTriggerType(failed),
                        triggerUser,
                        messageObject: { embeds: [banHardEmbed] },
                        deferred,
                        failed
                      });                      
                      failed = r?.failed || failed;
                      deferred = failed ? false : deferred;
                      trigger = r?.trigger || trigger;

                } catch (error) {
                  console.log(error, `Failed Positive Ban Message Attempt`);

                  // send an error message using an error message function
                  try {
                    let r = await scripts_djs.sendError({
                      error,
                      errorView: "long",
                      trigger,
                      triggerType: scripts_djs.getTriggerType(failed),
                      triggerUser,
                      commandName: "Hard Ban",
                      action: "Sending Update Message",
                      deferred: true,
                    });
                    failed = r?.failed || failed;
                    trigger = r?.trigger || trigger;
                    return;
                  } catch (error) {
                    console.log(error, `Failed Negative Ban Message Attempt`);
                  }
                }

                // ban the user
                try {
                  await target.ban({ reason: reason });
                } catch (error) {

                    // error embed
                  banHardEmbed = createEmbed({
                    title: "Error Banning User",
                    description: `> **${djsEmojis.exclamationmark} ${target} has not been banned.**\n> Error:\`\`\`js\n${error}\`\`\``,
                    color: scripts.getErrorColor(),
                    footer: {
                      text: client.user.displayName,
                      iconURL: client.user.displayAvatarURL(),
                    },
                  });

                  // send the error message via the send function
                  try {
                    let r = await scripts_djs.send({
                        trigger,
                        triggerType: scripts_djs.getTriggerType(failed),
                        triggerUser,
                        messageObject: { embeds: [banHardEmbed] },
                        deferred,
                        failed
                        });
                        failed = r?.failed || failed;
                        deferred = failed ? false : deferred;
                        trigger = r?.trigger || trigger;
                    return;
                  } catch (error) {
                    console.log(error, `Failed Negative Ban Message Attempt`);

                    // send an error message using an error message function
                    try {
                      let r = await scripts_djs.sendError({
                        error: error,
                        errorView: "long",
                        trigger: trigger,
                        triggerType: scripts_djs.getTriggerType(failed),
                        triggerUser: triggerUser,
                        commandName: "Hard Ban",
                        action: "Banning the Target User",
                        deferred: true,
                      });
                      failed = r?.failed || failed;
                      trigger = r?.trigger || trigger;
                      return;
                    } catch (error) {
                      console.log(error, `Failed Negative Ban Message Attempt`);
                    }
                  }
                }

                // update the trigger user saying that the target has been banned
                
                // update embed
                const banEmbed = createEmbed({
                  title: `${djsEmojis.checkmark} **User Banned**`,
                  thumbnail: target?.user?.displayAvatarURL(),
                  description: `> **${target} has been banned. Working on deleting their messages...** \n> \n>  ⨀ __Reason:__ \`${reason}\``,
                  color: scripts.getSuccessColor(),
                  footer: {
                    text: client.user.displayName,
                    iconURL: client.user.displayAvatarURL(),
                  },
                });

                // send the message to the user
                try {
                  let r = await scripts_djs.send({
                        trigger,
                        triggerType: scripts_djs.getTriggerType(failed),
                        triggerUser,
                        messageObject: { embeds: [banEmbed] },
                        deferred,
                        failed
                        });
                        failed = r?.failed || failed;
                        deferred = failed ? false : deferred;
                        trigger = r?.trigger || trigger;
                } catch (error) {
                  console.log(error, `Failed Positive Ban Message Attempt`);

                  // send an error message using an error message function
                  try {
                    let r = await scripts_djs.sendError({
                      error: error,
                      errorView: "long",
                      trigger: trigger,
                      triggerType: scripts_djs.getTriggerType(failed),
                      triggerUser: triggerUser,
                      commandName: "Hard Ban",
                      action:
                        "Sending Ban Confirmation Message. No Messages Deleted Yet",
                      deferred: true,
                    });
                    failed = r?.failed || failed;
                    trigger = r?.trigger || trigger;
                    return;
                  } catch (error) {
                    console.log(error, `Failed Negative Ban Message Attempt`);
                  }
                }

                // delete all messages from the user from within the server
                // loop through all channels and all messages in batches of 100 or less
                // use the last found message id to get the next batch of messages until there are no more messages to fetch
                let channels = await trigger.guild.channels.fetch();
                let count = 0;
                let messageCount = 0;
                let totalMessageCount = 0;

                // filter channels to only include text channels & voice text channels
                channels = channels.filter(
                  (channel) => channel.type === 0 || channel.type === 2
                ); // type 0 is a text channel // a voice channel is type 2

                for (const channel of channels.values()) {
                  if (channel.type === 4) continue; // type 4 is a category channel

                  // fetch the channel
                  await channel.fetch();

                  // update embed message stating, working on current channel and x/number of channels
                  const channelEmbed = createEmbed({
                    title: "Command Loading",
                    title: banEmbed.data.title,
                    description: `> ${
                      djsEmojis.loading_circle
                    } **Deleting Messages**\n> ${
                      messageCount > 0
                        ? `\`deleted ${messageCount}\``
                        : `\`deleted --\``
                    }\n> \`Scanning\` <#${channel?.id}> \`(${++count}/${
                      channels.size
                    })\`${
                      messageCount > 5000
                        ? `\n> \n> ${messageCount} messages deleted so far.`
                        : ""
                    }`,
                    color: banEmbed.data.color,
                    footer: banEmbed.data.footer,
                  });

                  // send the updated message to the channel
                  try {
                    let r = await scripts_djs.send(
                      trigger,
                      scripts_djs.getTriggerType(failed),
                      triggerUser,
                      { embeds: [channelEmbed] },
                      true
                    );
                    failed = r?.failed || failed;
                    trigger = r?.trigger || trigger;
                  } catch (error) {
                    console.log(error, `Failed Positive Ban Message Attempt`);
                    // TODO: Log Error
                  }

                  let last_id = null;
                  while (true) {
                    let messages = await channel?.messages.fetch({ // fetch the messages
                      limit: 100,
                      before: last_id,
                    });

                    if (messages?.size === 0 || !messages) break; // if there are no messages, break out of the loop

                    const userMessages = messages.filter( // filter the messages to only include messages from the target user
                      (m) => m.author.id === target.id 
                    );

                    if (userMessages.size !== 0) { // if there are messages from the target user, delete them
                      try {
                        await channel.bulkDelete(userMessages); // delete the messages in bulk
                        messageCount += userMessages.size;
                        totalMessageCount += messages.size;
                      } catch (error) {
                        console.log(`Failed to Delete Messages in Bulk`);
                        // if bulk delete fails, delete the messages individually
                        for (let message of userMessages) {
                          message = message[1]; // get the message object from the collection
                          try {
                            await message.delete(); // delete the message
                            messageCount++;
                          } catch (error) {
                            console.log(`Failed to Delete Message`);

                            // if the message fails to delete, send the message to the channel and ping the trigger user
                            const errEmbed = createEmbed({
                              title: `${djsEmojis.crossmark} **Error Occurred**`,
                              description: `> I was unable to delete all messages from ${target.displayName}.\n> Completed About ${messageCount}\n> \`\`\`js\n${error}\n\`\`\``,
                            });

                            try {
                              let r = await scripts_djs.send( // send the error message via the send function
                                trigger,
                                scripts_djs.getTriggerType(failed),
                                triggerUser,
                                { embeds: [errEmbed] },
                                true
                              );
                              failed = r?.failed || failed;
                              trigger = r?.trigger || trigger;
                            } catch (error) {
                              console.log(
                                error,
                                `Failed Negative Ban Message Attempt`
                              );
                                
                              try {
                                let r = await scripts_djs.sendError({ // send an error message using an error message function
                                  error: error,
                                  errorView: "short",
                                  trigger: trigger,
                                  triggerType: scripts_djs.getTriggerType(failed),
                                  triggerUser: triggerUser,
                                  commandName: "Hard Ban",
                                  action:
                                    "Deleting All Target Users Messages, User is Banned",
                                  deferred: true,
                                });
                                failed = r?.failed || failed;
                                trigger = r?.trigger || trigger;
                                return;
                              } catch (error) {
                                console.log(
                                  error,
                                  `Failed Negative Ban Message Attempt`
                                );
                              }
                            }
                          }
                        }
                      }
                    }
                    last_id = messages.last().id; // set the last id to the last message id in order to loop through the next batch of messages in the channel
                  }
                }

                const banEmbed2 = createEmbed({ // update the message to say that the user has been banned and all messages have been deleted
                  title: `${djsEmojis.checkmark} **User Banned**`,
                  thumbnail: target?.user?.displayAvatarURL(),
                  description: `> **${target.displayName}(<@${
                    target.id
                  }>) has been banned.**\n> \`ban type: hard\`\n> \`Reason: ${reason}\`${
                    messageCount > 0
                      ? `\n> **${djsEmojis.check_badge_gold} ${messageCount} Messages Wiped**`
                      : `\n> **${djsEmojis.check_badge_gold} All Messages Wiped**`
                  }`,
                  color: scripts.getSuccessColor(),
                  footer: {
                    text: client.user.displayName,
                    iconURL: client.user.displayAvatarURL(),
                  },
                });

                try {
                  let r = await scripts_djs.send( // send the updated message
                    trigger,
                    scripts_djs.getTriggerType(failed),
                    triggerUser,
                    { embeds: [banEmbed2] },
                    true
                  );
                  failed = r?.failed || failed;
                  trigger = r?.trigger || trigger;
                } catch (error) {
                  console.log(error, `Failed Positive Ban Message Attempt`);

                  try {
                    let r = await scripts_djs.sendError({ // send an error message using an error message function
                      error: error,
                      errorView: "long",
                      trigger: trigger,
                      triggerType: scripts_djs.getTriggerType(failed),
                      triggerUser: triggerUser,
                      commandName: "Hard Ban",
                      action: "Sending Hard Ban Confirmation Message",
                      deferred: true,
                    });
                    failed = r?.failed || failed;
                    trigger = r?.trigger || trigger;
                    return;
                  } catch (error) {
                    console.log(error, `Failed Negative Ban Message Attempt`);
                  }
                }
                break;
              case "permaban":
                // check to see if the interaction user has Administrator permissions
                if (!trigger.member.permissions.has("ADMINISTRATOR")) {

                  // if the user does not have Admin Perms, send an error embed
                  const errEmbed = createEmbed({
                    title: `${djsEmojis.crossmark} Unable to: ${category} ban`,
                    description: `> You are unable to ban ${target} permanently.\n> You must have the \`Administrator\` permission to use this command.`,
                    color: scripts.getErrorColor(),
                    footer: {
                      text: client.user.displayName,
                      iconURL: client.user.displayAvatarURL(),
                    },
                  });

                  try {
                    return await scripts_djs.send({ // send the error message via the send function
                        trigger,
                        triggerType: scripts_djs.getTriggerType(failed),
                        triggerUser,
                        messageObject: { embeds: [errEmbed] },
                        deferred,
                        failed
                        });
                        failed = r?.failed || failed;
      deferred = failed ? false : deferred;
      trigger = r?.trigger || trigger;
                  } catch (error) {
                    console.log(error, `Failed Negative Ban Message Attempt`);
                    
                  }
                }

                try {
                  await target.ban({ reason: reason }); // ban the user
                } catch (error) {

                    // if the ban fails, send an error embed
                  const banEmbed6 = createEmbed({
                    title: `${djsEmojis.exclamationmark} Error`,
                    description: `> **${djsEmojis.crossmark} ${target} has not been banned or added to permanent ban list.**\n> \n> Error:\`\`\`js\n${error}\n\`\`\``,
                    color: scripts.getErrorColor(),
                    footer: {
                      text: client.user.displayName,
                      iconURL: client.user.displayAvatarURL(),
                    },
                  });

                  try {
                    let r = await scripts_djs.send({ // send the error message via the send function
                        trigger,
                        triggerType: scripts_djs.getTriggerType(failed),
                        triggerUser,
                        messageObject: { embeds: [banEmbed6] },
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

                // update the trigger user saying that the target has been banned and now being added to the permanent ban list
                const banEmbed3 = createEmbed({
                  title: `${djsEmojis.checkmark} **User Banned**`,
                  description: `> ${target} has been banned. Working on adding them to the permanent ban list ${djsEmojis.loading_dotted}`,
                  thumbnail: target?.user?.displayAvatarURL(),
                  color: scripts.getSuccessColor(),
                  footer: {
                    text: client.user.displayName,
                    iconURL: client.user.displayAvatarURL(),
                  },
                });

                try {
                  let r = await scripts_djs.send({ // send the message via the send function
                    trigger,
                    triggerType: scripts_djs.getTriggerType(failed),
                    triggerUser,
                    messageObject: { embeds: [banEmbed3] },
                    deferred,
                    failed
                    });
                    failed = r?.failed || failed;
      deferred = failed ? false : deferred;
      trigger = r?.trigger || trigger;
                } catch (error) {
                  console.log(error, `Failed Positive Ban Message Attempt`);
                }

                const status = await commandCenter.permaBan({
                  target,
                  trigger,
                  triggerType,
                  reason,
                  action: "add",
                  deferred,
                  failed
            });

                // status: {status: true, reason: ``, trigger: trigger}
                trigger = status.trigger;

                //TODO: CONTINUE CHECKING THE PERMABAN FUNCTIONALITY
                if (status.status === true) {

                  // if the user was successfully added to the permanent ban list, send a success embed
                  const banEmbed4 = createEmbed({
                    title: `${djsEmojis.check_verified} User Banned & Added to Perm List`,
                    description: `> ${target} has been banned. **They have been added to the permanent ban list.**\n> \`Reason: ${reason}\``,
                    color: scripts.getSuccessColor(),
                    thumbnail: target?.user?.displayAvatarURL(),
                    footer: {
                      text: client.user.displayName,
                      iconURL: client.user.displayAvatarURL(),
                    },
                  });

                  try {
                    return await scripts_djs.send({ // send the message via the send function
                        trigger,
                        triggerType: scripts_djs.getTriggerType(failed),
                        triggerUser,
                        messageObject: { embeds: [banEmbed4] },
                        deferred,
                        failed
                        });
                  } catch (error) {
                    console.log(error, `Failed Positive Ban Message Attempt`);
                  }
                  return;
                } else {

                  // if the user was not successfully added to the permanent ban list, send an error embed
                  const banEmbed5 = createEmbed({
                    title: `${djsEmojis.crossmark} User Banned & NOT added to Perm List`,
                    description: `> ${target} has been banned.\n> \n> **I was unable to add them to the permanent ban list.**\n> \`Reason: ${reason}\`\n> \n> ${djsEmojis.exclamationmark} Error:\n>>>${status.reason}`,
                    color: scripts.getErrorColor(),
                    thumbnail: target?.user?.displayAvatarURL(),
                    footer: {
                      text: client.user.displayName,
                      iconURL: client.user.displayAvatarURL(),
                    },
                  });

                  try {
                    return await scripts_djs.send({ // send the message via the send function
                        trigger,
                        triggerType: scripts_djs.getTriggerType(failed),
                        triggerUser,
                        messageObject: { embeds: [banEmbed5] },
                        deferred,
                        failed
                        });
                  } catch (error) {
                    console.log(error, `Failed Positive Ban Message Attempt`);
                  }
                }

                break;
              default:
                // update the trigger user saying that the target is being banned
                let banStandardEmbed2 = createEmbed({
                    title: "Command Loading",
                    description: `> ${djsEmojis.loading_dotted} ${target} is being banned. Working on it...\n> \n> **⨀ Standard Ban:** bans the user.`,
                    color: scripts.getSuccessColor(),
                    thumbnail: target?.user?.displayAvatarURL(),
                    footer: {
                      text: client.user.displayName,
                      iconURL: client.user.displayAvatarURL(),
                    },
                  });
  
                  try {
                    let r = await scripts_djs.send({ // send the message via the send function
                      trigger,
                      triggerType: scripts_djs.getTriggerType(failed),
                      triggerUser,
                      messageObject: { embeds: [banStandardEmbed2] },
                      deferred,
                        failed
                      });
                      failed = r?.failed || failed;
      deferred = failed ? false : deferred;
      trigger = r?.trigger || trigger;
                  } catch (error) {
                    console.log(error, `Failed Positive Ban Message Attempt`);
                  }
  
                  try {
                    await target.ban({ reason: reason }); // ban the user
                  } catch (error) {
                      // if the ban fails, send an error embed
                    banStandardEmbed2 = createEmbed({
                      title: `${djsEmojis.exclamationmark} **Error Banning User**`,
                      description: `> ${target} has not been banned.\n> Error:\`\`\`js\n${error}\`\`\``,
                      color: scripts.getErrorColor(),
                      footer: {
                        text: client.user.displayName,
                        iconURL: client.user.displayAvatarURL(),
                      },
                    });
  
                    try {
                      let r = await scripts_djs.send({ // send the error message via the send function
                          trigger,
                          triggerType: scripts_djs.getTriggerType(failed),
                          triggerUser,
                          messageObject: { embeds: [banStandardEmbed2] },
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
  
                  // update the trigger user saying that the target has been banned
                  const successBanEmbed2 = createEmbed({
                    title: `${djsEmojis.check_badge_green} **User Banned**`,
                    description: `> ${target} has been banned.\n> \`Reason: ${reason}\``,
                    color: scripts.getSuccessColor(),
                    thumbnail: target?.user?.displayAvatarURL(),
                    footer: {
                      text: client.user.displayName,
                      iconURL: client.user.displayAvatarURL(),
                    },
                  });
  
                  try {
                    let r = await scripts_djs.send({ // send the message via the send function
                      trigger,
                      triggerType: scripts_djs.getTriggerType(failed),
                      triggerUser,
                      messageObject: { embeds: [successBanEmbed2] },
                      deferred,
                      failed
                      });
                      failed = r?.failed || failed;
                      deferred = failed ? false : deferred;
                      trigger = r?.trigger || trigger;
                      return;
                  } catch (error) {
                    console.log(error, `Failed Positive Ban Message Attempt`);
                  }

                break;
            }
        } catch(error){

        }

    }

    // Prefix Command
    if(type === "prefix"){


    }

}

// export the ban function
module.exports = ban;
