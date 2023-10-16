const createEmbed = require("../../create/createEmbed.js");
const scripts = require("../../scripts/scripts.js");

/**
 * Kicks a member or user from the server.
 *
 * @param {Object|string} target - The member or user to kick.
 * @param {string} reason - The reason for the kick.
 * @param {string} type - The type of command (slash or prefix).
 * @param {Object} trigger - The interaction or message that triggered the command.
 */
async function kick(target, reason, type, trigger) {
    // target can either be a member or a user
    // reason is a string, either provided or "No reason provided."
    // type can either be slash or prefix
    // trigger can either be an interaction or a message

    if (type === "slash") { // Slash Command Handler
        // target is a user object
        // trigger is an interaction

        // first of all, make sure that the target is of type Object and if not then take the string input and search the guild for a member with that name or id
        if (typeof target !== "object") {
            const members = await trigger.guild.members.fetch();
            const member =
                members.find((m) => m.user.username === target) ||
                members.find((m) => m.user.id === target);
            if (!member) {
                // if the member is not found, send an error embed
                const errEmbed = createEmbed({
                    title: `Unable to Kick`,
                    description: `❌ I couldn't find a user with the username/id of ${target}.`,
                    color: scripts.getErrorColor(),
                });
                console.log(`Kick Request Denied: ❌`);
                try {
                    return await trigger.reply({ embeds: [errEmbed] });
                } catch (error) {
                    console.log(error, `Failed Negative Kick Message Attempt`);
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
                    title: `Unable to Kick`,
                    description: `❌ I couldn't find a user with the username/id of ${target}.`,
                    color: scripts.getErrorColor(),
                });
                console.log(`Kick Request Denied: ❌`);
                try {
                    return await trigger.reply({ embeds: [errEmbed] });
                } catch (error) {
                    console.log(error, `Failed Negative Kick Message Attempt`);
                }
            }
            target = member;
        }

        // check if the bot can kick the member
        if (target.kickable === false) {
            // if the bot can't kick the member, send an error embed
            const errEmbed = createEmbed({
                title: `Unable to Kick`,
                description: `❌ You can't take action on <@${target.user.id}> since they have a higher role.`,
                color: scripts.getErrorColor(),
            });
            console.log(`Kick Request Denied: ❌`);
            try {
                return await trigger.reply({ embeds: [errEmbed] });
            } catch (error) {
                console.log(error, `Failed Negative Kick Message Attempt`);
            }
        }

        try {
            // kick the member
            await target.kick(reason);
        } catch (error) {
            console.log(error, `Failed Kick Attempt`);
            // if the kick fails, send an error embed
            const errEmbed = createEmbed({
                title: `Unable to Kick`,
                description: `❌ I couldn't kick <@${target.user.id}>. \n**Error:**\`\`\`js\n${error.message}\`\`\``,
                color: scripts.getErrorColor(),
            });
            try {
                return await trigger.reply({ embeds: [errEmbed] });
            } catch (error) {
                console.log(error, `Failed Negative Kick Message Attempt`);
            }
        }

        // send a success embed
        const embed = createEmbed({
            title: `Kicked!`,
            description: `✅ Successfully kicked <@${target.user.id}> with reason: ${reason}`,
            color: scripts.getSuccessColor(),
        });

        try {
            await trigger.reply({ embeds: [embed] });
        } catch (error) {
            console.log(error, `Failed Positive Kick Message Attempt`);
        }
        return console.log(`Kick Request Accepted: ✅`);
    
    
    } else if (type === "prefix") { // Prefix Command Handler
        // target will be a string, either a username or an id
        // trigger will be a message

        // get the member object
        const members = await trigger.guild.members.fetch();
        const member =
            members.find((m) => m.user.username === target) ||
            members.find((m) => m.user.id === target);

        if (!member) {
            // if the member is not found, send an error embed
            const errEmbed = createEmbed({
                title: `Unable to Kick`,
                description: `❌ I couldn't find a user with the username/id of ${target}.`,
                color: scripts.getErrorColor(),
            });
            console.log(`Kick Request Denied: ❌`);
            // reply to the message with the error embed
            try {
                return await trigger.reply({ embeds: [errEmbed] });
            } catch (error) {
                console.log(error, `Failed Negative Kick Message Attempt`);
                try {
                    // if the message no longer exists, then send the error embed to the channel
                    return await trigger.channel.send({
                        text: `<@${target.user.id}>`,
                        embeds: [errEmbed],
                    });
                } catch (error) {
                    console.log(error, `Failed Negative Kick Message Attempt`);
                }
            }
        }

        // check if the bot can kick the member
        if (member.kickable === false) {
            // if the bot can't kick the member, send an error embed
            const errEmbed = createEmbed({
                title: `Unable to Kick`,
                description: `❌ You can't take action on <@${member.user.id}> since they have a higher role.`,
                color: scripts.getErrorColor(),
            });
            console.log(`Kick Request Denied: ❌`);
            // reply to the message with the error embed
            try {
                return await trigger.reply({ embeds: [errEmbed] });
            } catch (error) {
                console.log(error, `Failed Negative Kick Message Attempt`);
                try {
                    // if the message no longer exists, then send the error embed to the channel
                    return await trigger.channel.send({
                        text: `<@${member.user.id}>`,
                        embeds: [errEmbed],
                    });
                } catch (error) {
                    console.log(error, `Failed Negative Kick Message Attempt`);
                }
            }
        }

        // kick the member
        try {
            await member.kick(reason);
        } catch (error) {
            console.log(error, `Failed Kick Attempt`);
            // if the kick fails, send an error embed
            const errEmbed = createEmbed({
                title: `Unable to Kick`,
                description: `❌ I couldn't kick <@${member.user.id}>. \n**Error:**\`\`\`js\n${error.message}\`\`\``,
                color: scripts.getErrorColor(),
            });
            try {
                return await trigger.reply({ embeds: [errEmbed] });
            } catch (error) {
                console.log(error, `Failed Negative Kick Message Attempt`);
                try {
                    // if the message no longer exists, then send the error embed to the channel
                    return await trigger.channel.send({
                        text: `<@${member.user.id}>`,
                        embeds: [errEmbed],
                    });
                } catch (error) {
                    console.log(error, `Failed Negative Kick Message Attempt`);
                }
            }
        }

        // send a success embed
        const embed = createEmbed({
            title: `Kicked!`,
            description: `✅ Successfully kicked <@${member.user.id}> with reason: ${reason}`,
            color: scripts.getSuccessColor(),
        });

        try {
            await trigger.reply({ embeds: [embed] });
        } catch (error) {
            console.log(error, `Failed Positive Kick Message Attempt`);
            try {
                // if the message no longer exists, then send the success embed to the channel
                await trigger.channel.send({
                    text: `<@${member.user.id}>`,
                    embeds: [embed],
                });
            } catch (error) {
                console.log(error, `Failed Positive Kick Message Attempt`);
            }
        }
        return console.log(`Kick Request Accepted: ✅`);
    }
}
