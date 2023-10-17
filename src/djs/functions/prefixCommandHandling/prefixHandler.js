const client = require("../../index.js");
const commandMatchMaker = require("./commandMatchMaker.js");
const createEmb = require("../create/createEmbed.js")
const commandCenter = require("./commandCenter.js");
const scripts = require("../scripts/scripts.js");
const extractCommand = require("./extractCommand.js");

// create a command that is a prefix command handler

// message object & a string (the message text) will be passed into it
// the function must check if it contains a prefix
// if so check to see if that prefix is turned on in the current server
// if so extract the command name and arguments (each arg separated by a space) from the message text
// then use a switch case tree to determine which command to run
// if the command is not found, do nothing
// if the prefix is not found, do nothing
// if the prefix is found but the command is not found, do nothing
// if the prefix is found and the command is found, run the command


const sendErrorEmbed = async (message, error, commandName) => {
    const errorEmbed = createEmb({
        title: `❗️ Error`,
        description: `❌ I was unable to run the ${commandName} command for some reason.\n\`\`\`js\n${error}\n\`\`\``,
        color: scripts.getErrorColor(),
        footer:{
            text: client.user.displayName,
            iconURL: client.user.avatarURL()
        }
    })
    try{
        await message.reply({embeds: [errorEmbed]});
    } catch (error){
        console.log(error, `Failed Error Reply Attempt`);
        // if the message no longer exists, send the embed to the channel
        try{
            await message.channel.send({text: `<@${message.user.id}>`, embeds: [errorEmbed]});
        } catch (error){
            console.log(error, `Failed Error Channel Send Attempt`);
        }
    }
}


async function prefixHandler(message, text) {
    const guild = message.guild;

    // search the db for a current prefix for the guild
    const guildObject = await client.getServer(guild);

    if (guildObject.commandStyle === "slash"){
        return;
    }

    const prefix = guildObject?.commandPrefix;

// Check to see if the first non-space character is the prefix
for (let i = 0; i < text.length; i++) {
    if (text[i] !== ' ') {
        if (text[i] !== prefix) {
            return;
        }
        // Trim leading spaces from the text
        text = text.slice(i).trim();
        // Now 'text' holds the modified string with leading spaces removed.
        break; // Exit the loop once the first non-space character is checked.
    }
}

    const commandInfo = extractCommand(prefix, text)

    const command = commandMatchMaker(commandInfo.commandName);

    if(!command){
        return;
    }

    const commandName = command.data.name;

    const commandArgs = commandInfo?.args;

    const {prefix_format, prefix_example, permissions, about, sudo} = command;

    const permissionsCheck = async (userPermissions, permissions, message) => {
        if(!userPermissions.includes(permissions) && !userPermissions.includes("Administrator")){
            // send an embed to the interaction user
            const errorEmbed = createEmb({
                title: `❗️ Error`,
                description: `❌ You do not have the permissions needed to run this command.\n\nPermissions Needed: \`${permissions}\``,
                color: scripts.getErrorColor(),
                footer:{
                    text: client.user.displayName,
                    iconURL: client.user.avatarURL()
                }
            })
            try{
                await message.reply({embeds: [errorEmbed]});
            } catch (error){
                console.log(error, `Failed Error Reply Attempt`);
                // if the message no longer exists, send the embed to the channel
                try{
                    await message.channel.send({text: `<@${message.user.id}>`, embeds: [errorEmbed]});
                } catch (error){
                    console.log(error, `Failed Error Channel Send Attempt`);
                }
            }
            return false;
        } else {
            return true;
        }
    }

    const commandInfoEmbed = createEmb({
        title: `${commandName}`,
        author:{
            name: "Command Info",
        },
        description: `About:\`\`\`${about}\`\`\`\n\nFormal Name: \`${commandName}\`\n\nPermissions Needed: \`${permissions}\`\n\nPrefix Command Format: \`\`\`${prefix_format}\`\`\`\nExample: \`\`\`${prefix_example}\`\`\`\n\nSudo Names: \`${sudo}\``,
        color: "#7998ad",
        footer:{
            text: client.user.displayName,
            iconURL: client.user.avatarURL()
        }

    })

    // if the first argument for any command is "help" or "info" or "information"
    // send an embed with the command info
    if(commandArgs[0] === "help" || commandArgs[0] === "info" || commandArgs[0] === "information"){
        // reply to the message with an embed displaying the command info
        try{
            await message.reply({embeds: [commandInfoEmbed]});
        } catch (error){
            console.log(error, `Failed Command Info Reply Attempt`);
            // if the message no longer exists, send the embed to the channel
            try{
                await message.channel.send({text: `<@${message.user.id}>`, embeds: [commandInfoEmbed]});
            } catch (error){
                console.log(error, `Failed Command Info Channel Send Attempt`);
            }
        }
        return;
    }

    switch(commandName){

        // set-command-style Command

        case "set-command-style":
            if((!commandArgs || commandArgs.length === 0) || (commandArgs[0] !== "slash" && commandArgs[0] !== "prefix" && commandArgs[0] !== "both")){
                // reply to the message with an embed displaying the command info
                try{
                    await message.reply({embeds: [commandInfoEmbed]});
                } catch (error){
                    console.log(error, `Failed Command Info Reply Attempt`);
                    // if the message no longer exists, send the embed to the channel
                    try{
                        await message.channel.send({text: `<@${message.user.id}>`, embeds: [commandInfoEmbed]});
                    } catch (error){
                        console.log(error, `Failed Command Info Channel Send Attempt`);
                    }
                }
                return;
            }

            // check the user for the permissions needed based on the permissions array
            const userPermissions = message.member.permissions.toArray();

            const userHasPermissions = await permissionsCheck(userPermissions, permissions, message);
            if(!userHasPermissions){
                return;
            }

            let newPrefix = prefix;
            if(commandArgs[1] && commandArgs[1] !== ""){
                newPrefix = commandArgs[1];
                // Remove leading spaces
                newPrefix = newPrefix.replace(/^\s+/g, '');
                // Remove trailing spaces
                newPrefix = newPrefix.replace(/\s+$/g, '');
            }

            if(commandArgs[0] === "slash"){
                try{
                    return await commandCenter.setCommandStyle("slash", "prefix", message);
                } catch (error){
                    console.log(error, `Failed Command Style Set Attempt`);
                    // send error embed to the interaction user
                    try{
                        return await sendErrorEmbed(message, error, commandName);
                    } catch (error){
                        console.log(error, `Failed Error Embed Send Attempt`);
                    }
                }
            } else if(commandArgs[0] === "prefix"){
                try{
                    return await commandCenter.setCommandStyle("prefix", "prefix", message, newPrefix);
                } catch (error){
                    console.log(error, `Failed Command Style Set Attempt`);
                    // send error embed to the interaction user
                    try{
                        return await sendErrorEmbed(message, error, commandName);
                    } catch (error){
                        console.log(error, `Failed Error Embed Send Attempt`);
                    }
                }
            } else if(commandArgs[0] === "both"){
                try{
                    return await commandCenter.setCommandStyle("both", "prefix", message, newPrefix);
                } catch (error){
                    console.log(error, `Failed Command Style Set Attempt`);
                    // send error embed to the interaction user
                    try{
                        return await sendErrorEmbed(message, error, commandName);
                    } catch (error){
                        console.log(error, `Failed Error Embed Send Attempt`);
                    }
                }
            }
            
            break;

            // kick Command

        case "kick":
            // check the user for the permissions needed based on the permissions array
            const userPermissionsKick = message.member.permissions.toArray();

            const userHasPermissionsKick = await permissionsCheck(userPermissionsKick, permissions, message);
            if(!userHasPermissionsKick){
                return;
            }

            // if no arguments are provided, send an embed with the command info
            if(!commandArgs || commandArgs.length === 0){
                // reply to the message with an embed displaying the command info
                try{
                    await message.reply({embeds: [commandInfoEmbed]});
                } catch (error){
                    console.log(error, `Failed Command Info Reply Attempt`);
                    // if the message no longer exists, send the embed to the channel
                    try{
                        await message.channel.send({text: `<@${message.user.id}>`, embeds: [commandInfoEmbed]});
                    } catch (error){
                        console.log(error, `Failed Command Info Channel Send Attempt`);
                    }
                }
                return;
            }

            const user = message.mentions.users.first() || commandArgs[0];
            const trialArg0 = commandArgs[0];
            const reason = commandArgs[1] ? commandArgs[1] : "No reason provided.";

            try{
                return await commandCenter.kick(user, reason, "prefix", message);
            } catch (error){
                console.log(error, `Failed Kick Attempt`);
                // send error embed to the interaction user
                try{
                    return await sendErrorEmbed(message, error, commandName);
                } catch (error){
                    console.log(error, `Failed Error Embed Send Attempt`);
                }
            }
            break;

            // ban Command



        default:
    }



}

module.exports = prefixHandler;