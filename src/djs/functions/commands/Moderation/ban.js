const djsEmojis = require("../../scripts/djsEmojis.js");


// create a function that will be called when the ban command is ran.
// four different types of ban are supported: standard, soft, hard, and perma.
// standard: ban the user from the server.
// soft: ban the user then immediately unban them.
// hard: ban the user and delete their messages.
// permaban: ban the user, add them to the permanent ban list, and delete their messages.

async function ban(target, category, reason, type, trigger){



    // Slash Command
    if(type === "slash"){
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
            return await trigger.editReply({ embeds: [errEmbed] });
          } catch (error) {
            console.log(error, `Failed Negative Ban Message Attempt`);
          }
        }
        target = member;
      } else{
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
          return await trigger.editReply({ embeds: [errEmbed] });
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
            return await trigger.editReply({ embeds: [errEmbed] });
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
            return await trigger.editReply({ embeds: [errEmbed] });
            } catch (error) {
            console.log(error, `Failed Negative Ban Message Attempt`);
            }
        }

        let backupReply, failed;
        try{
            // ban the user
            switch(category){
                case "standard":
                let banStandardEmbed = createEmbed({
                    description: `${djsEmojis.loading_dotted} ${target} is being banned. Working on it...`,
                    color: scripts.getSuccessColor(),
                    footer: {
                        text: client.user.displayName,
                        iconURL: client.user.displayAvatarURL()
                    }
                });
                try {
                    return backupReply = await trigger.channel.send({ text: `<@${trigger.user.id}>`, embeds: [banStandardEmbed] });
                    await trigger.editReply({ embeds: [banStandardEmbed] });
                } catch (error) {
                    console.log(error, `Failed Positive Ban Message Attempt`);
                    // if the message fails to send, send the message to the channel and ping the trigger user
                    try {
                        failed = true;
                        return backupReply = await trigger.channel.send({ text: `<@${trigger.user.id}>`, embeds: [banStandardEmbed] });
                    } catch (error) {
                        console.log(error, `Failed Positive Ban Message Attempt`);
                    }
                }
                    try {
                        await target.ban({reason: reason});
                    } catch (error) {
                         banStandardEmbed = createEmbed({
                            title: "Error Banning User",
                            description: `${djsEmojis.exclamationmark} ${target} has not been banned. Error:\`\`\`js\n${error}\`\`\``,
                            color: scripts.getErrorColor(),
                            footer: {
                                text: client.user.displayName,
                                iconURL: client.user.displayAvatarURL()
                            }
                        });
                        try {
                            return await trigger.editReply({ embeds: [banStandardEmbed] });
                        } catch (error) {
                            console.log(error, `Failed Negative Ban Message Attempt`);
                            // if the message fails to send, send the message to the channel and ping the trigger user
                            try {
                                failed = true;
                                return backupReply = await trigger.channel.send({ text: `<@${trigger.user.id}>`, embeds: [banStandardEmbed] });
                            } catch (error) {
                                console.log(error, `Failed Negative Ban Message Attempt`);
                            }
                        }
                        
                    }
                    break;
                case "soft": // TODO: Add embed updates to user
                try {
                    await target.ban({reason: reason});
                } catch (error) {
                     banStandardEmbed = createEmbed({
                        title: "Error Banning User",
                        description: `${djsEmojis.exclamationmark} ${target} has not been banned. Error:\`\`\`js\n${error}\`\`\``,
                        color: scripts.getErrorColor(),
                        footer: {
                            text: client.user.displayName,
                            iconURL: client.user.displayAvatarURL()
                        }
                    });
                    try {
                        return await trigger.editReply({ embeds: [banStandardEmbed] });
                    } catch (error) {
                        console.log(error, `Failed Negative Ban Message Attempt`);
                        // if the message fails to send, send the message to the channel and ping the trigger user
                        try {
                            failed = true;
                            return backupReply = await trigger.channel.send({ text: `<@${trigger.user.id}>`, embeds: [banStandardEmbed] });
                        } catch (error) {
                            console.log(error, `Failed Negative Ban Message Attempt`);
                        }
                    }
                    
                }
                    
                    try {
                        await trigger.guild.members.unban(target.id);
                    } catch (error) {
                         banStandardEmbed = createEmbed({
                            title: "Error Banning User",
                            description: `${djsEmojis.exclamationmark} ${target} has not been unbanned after being banned briefly. Error:\`\`\`js\n${error}\`\`\``,
                            color: scripts.getErrorColor(),
                            footer: {
                                text: client.user.displayName,
                                iconURL: client.user.displayAvatarURL()
                            }
                        });
                        try {
                            return await trigger.editReply({ embeds: [banStandardEmbed] });
                        } catch (error) {
                            console.log(error, `Failed Negative Ban Message Attempt`);
                            // if the message fails to send, send the message to the channel and ping the trigger user
                            try {
                                failed = true;
                                return backupReply = await trigger.channel.send({ text: `<@${trigger.user.id}>`, embeds: [banStandardEmbed] });
                            } catch (error) {
                                console.log(error, `Failed Negative Ban Message Attempt`);
                            }
                        }
                        
                    }
                    break;
                case "hard":
                    let banHardEmbed;
                    try {
                        await target.ban({reason: reason});
                    } catch (error) {
                        banHardEmbed = createEmbed({
                            title: "Error Banning User",
                            description: `${djsEmojis.exclamationmark} ${target} has not been banned. Error:\`\`\`js\n${error}\`\`\``,
                            color: scripts.getErrorColor(),
                            footer: {
                                text: client.user.displayName,
                                iconURL: client.user.displayAvatarURL()
                            }
                        });
                        try {
                            return await trigger.editReply({ embeds: [banHardEmbed] });
                        } catch (error) {
                            console.log(error, `Failed Negative Ban Message Attempt`);
                            // if the message fails to send, send the message to the channel and ping the trigger user
                            try {
                                failed = true;
                                return backupReply = await trigger.channel.send({ text: `<@${trigger.user.id}>`, embeds: [banHardEmbed] });
                            } catch (error) {
                                console.log(error, `Failed Negative Ban Message Attempt`);
                            }
                        }
                        
                    }
                    // update the trigger user saying that the target has been banned
                    const banEmbed = createEmbed({
                        title: `User Banned`,
                        description: `${djsEmojis.checkmark} ${target} has been banned. Working on deleting their messages.`,
                        color: scripts.getSuccessColor(),
                        footer: {
                            text: client.user.displayName,
                            iconURL: client.user.displayAvatarURL()
                        }
                    });
                    try {
                        await trigger.editReply({ embeds: [banEmbed] });
                    } catch (error) {
                        console.log(error, `Failed Positive Ban Message Attempt`);
                        // if the message fails to send, send the message to the channel and ping the trigger user
                        try {
                            failed = true;
                            backupReply = await trigger.channel.send({ text: `<@${trigger.user.id}>`, embeds: [banEmbed] });
                        } catch (error) {
                            console.log(error, `Failed Positive Ban Message Attempt`);
                        }

                    }


                    // delete all messages from the user from within the server
                    // loop through all channels and all messages in batches of 100 or less
                    // use the last found message id to get the next batch of messages until there are no more messages to fetch, without using a forEach loop
                    const channels = await trigger.guild.channels.fetch();
                    let count = 0;
                    let messageCount = 0;
                    for (const channel of channels.values()) {
                        // send a message stating, working on current channel and x/number of channels
                        const channelEmbed = createEmbed({
                            title: banEmbed.title,
                            description: `<a:verify:1100873948041855017> **Deleting Messages**\n\n\`Working on ${channel.name} (${++count}/${channels.size})\`${messageCount > 5000 ? `\n\n${messageCount} messages deleted so far.` : ""}}`,
                            color: banEmbed.color,
                            footer: banEmbed.footer
                        });
                        // send the updated message to the channel
                        try {
                            if(failed) await backupReply.edit({ embeds: [channelEmbed] });
                            else await trigger.editReply({ embeds: [channelEmbed] });
                        } catch (error) {
                            console.log(error, `Failed Positive Ban Message Attempt`);
                            // if the message fails to send, send the message to the channel and ping the trigger user
                            try {
                                failed = true;
                                backupReply = await trigger.channel.send({ text: `<@${trigger.user.id}>`, embeds: [channelEmbed] });
                            } catch (error) {
                                console.log(error, `Failed Positive Ban Message Attempt`);
                            }
                        }
                        let last_id = 0;
                        while (true) {
                            const messages = await channel.messages.fetch({ limit: 100, before: last_id });
                            if (messages?.size === 0) break;
                            const userMessages = messages.filter((m) => m.author.id === target.id);
                            try {
                                await channel.bulkDelete(userMessages);
                                messageCount += messages.size;
                            } catch (error) {
                                console.log(`Failed to Delete Messages in Bulk`);
                                // if bulk delete fails, delete the messages individually
                                userMessages.forEach(async (message) => {
                                    try {
                                        await message.delete();
                                        messageCount++;
                                    } catch (error) {
                                        console.log(`Failed to Delete Message`);
                                        // if the message fails to delete, send the message to the channel and ping the trigger user
                                        const errEmbed = createEmbed({  
                                            title: `Error Occurred`,
                                            description: `${djsEmojis.crossmark} I was unable to delete all messages from ${target.displayName}.\nCompleted About ${messageCount}\n\`\`\`js\n${error}\n\`\`\``,
                                    });
                                        try {
                                            if(failed) await backupReply.edit({ embeds: [errEmbed] });
                                            else await trigger.editReply({ embeds: [errEmbed] });
                                        } catch (error) {
                                            console.log(error, `Failed Negative Ban Message Attempt`);
                                            // if the message fails to send, send the message to the channel and ping the trigger user
                                            try {
                                                failed = true;
                                                backupReply = await trigger.channel.send({ text: `<@${trigger.user.id}>`, embeds: [errEmbed] });
                                            } catch (error) {
                                                console.log(error, `Failed Negative Ban Message Attempt`);
                                            }
                                        }
                                    }
                                });
                            }   
                            last_id = messages.last().id;
                        }

                        // update the message to say that the channel is done
                        const channelEmbed2 = createEmbed({
                            title: banEmbed.title,
                            description: `${djsEmojis.checkmark} ${target.displayName} has been banned.\n<a:check2:1147031982329581668> **All Their Messages Have Been Deleted**${messageCount > 5000 ? `\n\n\`${messageCount} Total Messages Deleted.\`` : ""}\n\n**Last Checked Channel:** __${channel.name}__\n**\`Total Channels Checked: ${count}/${channels.size}\`**`,
                            color: scripts.getSuccessColor(),
                            footer: banEmbed.footer
                        });
                        // send the updated message to the channel
                        try {
                            if(failed) await backupReply.edit({ embeds: [channelEmbed2] });
                            else await trigger.editReply({ embeds: [channelEmbed2] });
                        } catch (error) {
                            console.log(error, `Failed Positive Ban Message Attempt`);
                            // if the message fails to send, send the message to the channel and ping the trigger user
                            try {
                                failed = true;
                                backupReply = await trigger.channel.send({ text: `<@${trigger.user.id}>`, embeds: [channelEmbed2] });
                            } catch (error) {
                                console.log(error, `Failed Positive Ban Message Attempt`);
                            }
                        }
                    }

                    // update the message to say that the user has been banned and all messages have been deleted
                    const banEmbed2 = createEmbed({
                        title: banEmbed.title,
                        description: `${djsEmojis.checkmark} ${target.displayName} has been banned.\n<a:check2:1147031982329581668> **All Their Messages Have Been Deleted**${messageCount > 5000 ? `\n\n**\`${messageCount} Total Messages Deleted.\`**` : ""}`,
                        color: scripts.getSuccessColor(),
                        footer: banEmbed.footer
                    });

                    // send the updated message to the channel
                    try {
                        if(failed) await backupReply.edit({ embeds: [banEmbed2] });
                        else await trigger.editReply({ embeds: [banEmbed2] });
                    } catch (error) {
                        console.log(error, `Failed Positive Ban Message Attempt`);
                        // if the message fails to send, send the message to the channel and ping the trigger user
                        try {
                            failed = true;
                            backupReply = await trigger.channel.send({ text: `<@${trigger.user.id}>`, embeds: [banEmbed2] });
                        } catch (error) {
                            console.log(error, `Failed Positive Ban Message Attempt`);
                        }
                    }
                    break;
                case "perma":
                    let failed = false;
                    let backupReply;
                    // check to see if the interaction user has Administrator permissions
                    if (!trigger.member.permissions.has("ADMINISTRATOR")) {
                        // if the user does not have Admin Perms, send an error embed
                        const errEmbed = createEmbed({
                        title: `Unable to Ban: ${category}`,
                        description: `${djsEmojis.crossmark} You are unable to ban ${target} permanently.\nYou must have the \`Administrator\` permission to use this command.`,
                        color: scripts.getErrorColor(),
                        footer: {
                            text: client.user.displayName,
                            iconURL: client.user.displayAvatarURL()
                        }
                        });
                        console.log(`Ban [${category}] Request Denied: ${djsEmojis.crossmark}`);
                        try {
                        return await trigger.editReply({ embeds: [errEmbed] });
                        } catch (error) {
                        console.log(error, `Failed Negative Ban Message Attempt`);
                        // if the message fails to send, send the message to the channel and ping the trigger user
                        try {
                            failed = true;
                            return backupReply = await trigger.channel.send({ text: `<@${trigger.user.id}>`, embeds: [errEmbed] });
                        } catch (error) {
                            console.log(error, `Failed Negative Ban Message Attempt`);
                        }
                        }
                    }

                    // ban the user

                    try {
                        await target.ban({reason: reason});
                    } catch (error) {
                        //TODO: add error embed message
                        const banEmbed6 = createEmbed({
                            title: `${djsEmojis.exclamationmark} Error`,
                            description: `**${djsEmojis.crossmark} ${target} has not been banned or added to permanent ban list.**\n\nError:\`\`\`js\n${error}\n\`\`\``,
                            color: scripts.getErrorColor(),
                            footer: {
                                text: client.user.displayName,
                                iconURL: client.user.displayAvatarURL()
                            }
                        });
                        try {
                            if(failed) await backupReply.edit({ embeds: [banEmbed6] });
                            else return await trigger.editReply({ embeds: [banEmbed6] });
                        } catch (error) {
                            console.log(error, `Failed Negative Ban Message Attempt`);
                            // if the message fails to send, send the message to the channel and ping the trigger user
                            try {
                                failed = true;
                                return backupReply = await trigger.channel.send({ text: `<@${trigger.user.id}>`, embeds: [banEmbed6] });
                            } catch (error) {
                                console.log(error, `Failed Negative Ban Message Attempt`);
                            }
                        }
                        
                    }
                    // update the trigger user saying that the target has been banned and now being added to the permanent ban list
                    const banEmbed3 = createEmbed({
                        title: `User Banned`,
                        description: `${djsEmojis.checkmark} ${target} has been banned. Working on adding them to the permanent ban list ${djsEmojis.loading_dotted}`,
                        color: scripts.getSuccessColor(),
                        footer: {
                            text: client.user.displayName,
                            iconURL: client.user.displayAvatarURL()
                        }
                    });
                    try {
                        await trigger.editReply({ embeds: [banEmbed3] });
                    } catch (error) {
                        console.log(error, `Failed Positive Ban Message Attempt`);
                        // if the message fails to send, send the message to the channel and ping the trigger user
                        try {
                            failed = true;
                            backupReply = await trigger.channel.send({ text: `<@${trigger.user.id}>`, embeds: [banEmbed3] });
                        } catch (error) {
                            console.log(error, `Failed Positive Ban Message Attempt`);
                        }
                    }

                    const status = await commandCenter.addPermaBan(target, trigger, reason);

                    // update the trigger user saying that the target has been banned and now being added to the permanent ban list
                    if(status === true && typeof status !== "string"){
                        // if the user was successfully added to the permanent ban list, send a success embed
                        const banEmbed4 = createEmbed({
                            title: `User Banned & Added to Perm List`,
                            description: `${djsEmojis.check_verified} ${target} has been banned. **They have been added to the permanent ban list.**`,
                            color: scripts.getSuccessColor(),
                            footer: {
                                text: client.user.displayName,
                                iconURL: client.user.displayAvatarURL()
                            }
                        });
                        try {
                            if(failed) await backupReply.edit({ embeds: [banEmbed4] });
                            else await trigger.editReply({ embeds: [banEmbed4] });
                        } catch (error) {
                            console.log(error, `Failed Positive Ban Message Attempt`);
                            // if the message fails to send, send the message to the channel and ping the trigger user
                            try {
                                failed = true;
                                backupReply = await trigger.channel.send({ text: `<@${trigger.user.id}>`, embeds: [banEmbed4] });
                            } catch (error) {
                                console.log(error, `Failed Positive Ban Message Attempt`);
                            }
                        }
                        return;
                    } else {
                        // if the user was not successfully added to the permanent ban list, send an error embed
                        const banEmbed5 = createEmbed({
                            title: `User Banned & NOT added to Perm List`,
                            description: `${djsEmojis.crossmark} ${target} has been banned.\n\n**I was unable to add them to the permanent ban list.**\n\n${djsEmojis.exclamationmark} Error:\n>>>${status}`,
                            color: scripts.getErrorColor(),
                            footer: {
                                text: client.user.displayName,
                                iconURL: client.user.displayAvatarURL()
                            }
                        });
                        try {
                            if(failed) await backupReply.edit({ embeds: [banEmbed5] });
                            else return await trigger.editReply({ embeds: [banEmbed5] });
                        } catch (error) {
                            console.log(error, `Failed Positive Ban Message Attempt`);
                            // if the message fails to send, send the message to the channel and ping the trigger user
                            try {
                                failed = true;
                                return backupReply = await trigger.channel.send({ text: `<@${trigger.user.id}>`, embeds: [banEmbed5] });
                            } catch (error) {
                                console.log(error, `Failed Positive Ban Message Attempt`);
                            }
                        }
                    }

                    break;
                default:
                    await target.ban({reason: reason});
                    break;
            }
        } catch(error){

        }

    }

    // Prefix Command
    if(type === "prefix"){

    }

}
