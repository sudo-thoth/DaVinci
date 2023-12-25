const client = require("./../../index.js");
const commandMatchMaker = require("./commandMatchMaker.js");
const createEmb = require("./../create/createEmbed.js");
const commandCenter = require("./commandCenter.js");
const scripts = require("./../scripts/scripts.js");
const extractCommand = require("./extractCommand.js");

/**
 * Sends an error embed to the message author or channel if the message author is not available.
 * @param {Message} message - The message object that triggered the error.
 * @param {Error} error - The error object that was thrown.
 * @param {string} commandName - The name of the command that was attempted to run.
 * @returns {Promise<void>}
 */
const sendErrorEmbed = async (message, error, commandName) => {
  const errorEmbed = createEmb({
    title: `❗️ Error`,
    description: `❌ I was unable to run the ${commandName} command for some reason.\n\`\`\`js\n${error}\n\`\`\``,
    color: scripts.getErrorColor(),
    footer: {
      text: client.user.displayName,
      iconURL: client.user.avatarURL(),
    },
  });
  try {
    await message.reply({ embeds: [errorEmbed] });
  } catch (error) {
    console.log(error, `Failed Error Reply Attempt`);
    // if the message no longer exists, send the embed to the channel
    try {
      await message.channel.send({
        text: `<@${message.user.id}>`,
        embeds: [errorEmbed],
      });
    } catch (error) {
      console.log(error, `Failed Error Channel Send Attempt`);
    }
  }
};

/**
 * Checks if a user's permissions include the required permissions to run a command.
 *
 * @param {Array} userPermissions - Array of the user's permissions.
 * @param {string} permissions - The required permission(s) to run the command.
 * @param {object} message - The message or interaction object to send replies.
 * @returns {boolean} - Returns true if the user has the required permissions, false otherwise.
 */
const permissionsCheck = async (userPermissions, permissions, message) => {
  // Check if the user's permissions include the required permission or "Administrator".
  if (
    !userPermissions.includes(permissions) &&
    !userPermissions.includes("Administrator")
  ) {
    // Create an error embed to inform the user about insufficient permissions.
    const errorEmbed = createEmb({
      title: `❗️ Error`,
      description: `❌ You do not have the permissions needed to run this command.\n\nPermissions Needed: \`${permissions}\``,
      color: scripts.getErrorColor(),
      footer: {
        text: client.user.displayName,
        iconURL: client.user.avatarURL(),
      },
    });

    try {
      // Reply to the message or interaction with the error embed.
      await message.reply({ embeds: [errorEmbed] });
    } catch (error) {
      console.log(error, `Failed Error Reply Attempt`);
      // If the message no longer exists, send the embed to the channel.
      try {
        await message.channel.send({
          text: `<@${message.user.id}>`,
          embeds: [errorEmbed],
        });
      } catch (error) {
        console.log(error, `Failed Error Channel Send Attempt`);
      }
    }
    // Return false to indicate that the user doesn't have the required permissions.
    return false;
  } else {
    // Return true to indicate that the user has the required permissions.
    return true;
  }
};

/**
 * Handles command prefix and extraction of the command from the message text.
 *
 * @param {object} message - The message object.
 * @param {string} text - The text containing the command.
 */
async function prefixHandler(message, text) {
  const guild = message.guild;

  // Search the database for the current prefix for the guild.
  const guildObject = await client.getServer(guild);

  if (guildObject.commandStyle === "slash") {
    return;
  }

  const prefix = guildObject?.commandPrefix;

  // Check to see if the first non-space character is the prefix.
  for (let i = 0; i < text.length; i++) {
    if (text[i] !== " ") {
      if (text[i] !== prefix) {
        return;
      }
      // Trim leading spaces from the text.
      text = text.slice(i).trim();
      // Now 'text' holds the modified string with leading spaces removed.
      break; // Exit the loop once the first non-space character is checked.
    }
  }

  const commandInfo = extractCommand(prefix, text);

  const command = commandMatchMaker(commandInfo.commandName);

  if (!command) {
    return;
  }

  const commandName = command.data.name;

  const commandArgs = commandInfo?.args;

  const { prefix_format, prefix_example, permissions, about, sudo } = command;

  const commandInfoEmbed = createEmb({
    title: `${commandName}`,
    author: {
      name: "Command Info",
    },
    description: `About:\`\`\`${about}\`\`\`\n\nFormal Name: \`${commandName}\`\n\nPermissions Needed: \`${permissions}\`\n\nPrefix Command Format: \`\`\`${prefix_format}\`\`\`\nExample: \`\`\`${prefix_example}\`\`\`\n\nSudo Names: \`${sudo}\``,
    color: "#7998ad",
    footer: {
      text: client.user.displayName,
      iconURL: client.user.avatarURL(),
    },
  });

  // If the first argument for any command is "help" or "info" or "information",
  // send an embed with the command info.
  if (
    commandArgs[0] === "help" ||
    commandArgs[0] === "info" ||
    commandArgs[0] === "information"
  ) {
    // Reply to the message with an embed displaying the command info.
    try {
      await message.reply({ embeds: [commandInfoEmbed] });
    } catch (error) {
      console.log(error, `Failed Command Info Reply Attempt`);
      // If the message no longer exists, send the embed to the channel.
      try {
        await message.channel.send({
          text: `<@${message.user.id}>`,
          embeds: [commandInfoEmbed],
        });
      } catch (error) {
        console.log(error, `Failed Command Info Channel Send Attempt`);
      }
    }
    return;
  }

  // command functions switch case tree
  switch (commandName) {
    // set-command-style Command

    case "set-command-style":
      if (
        !commandArgs ||
        commandArgs.length === 0 ||
        (commandArgs[0] !== "slash" &&
          commandArgs[0] !== "prefix" &&
          commandArgs[0] !== "both")
      ) {
        // Reply to the message with an embed displaying the command info.
        try {
          await message.reply({ embeds: [commandInfoEmbed] });
        } catch (error) {
          console.log(error, `Failed Command Info Reply Attempt`);
          // If the message no longer exists, send the embed to the channel.
          try {
            await message.channel.send({
              text: `<@${message.user.id}>`,
              embeds: [commandInfoEmbed],
            });
          } catch (error) {
            console.log(error, `Failed Command Info Channel Send Attempt`);
          }
        }
        return;
      }

      // Check the user for the permissions needed based on the permissions array.
      const userPermissions = message.member.permissions.toArray();

      const userHasPermissions = await permissionsCheck(
        userPermissions,
        permissions,
        message
      );
      if (!userHasPermissions) {
        return;
      }

      let newPrefix = prefix;
      if (commandArgs[1] && commandArgs[1] !== "") {
        newPrefix = commandArgs[1];
        // Remove leading spaces
        newPrefix = newPrefix.replace(/^\s+/g, "");
        // Remove trailing spaces
        newPrefix = newPrefix.replace(/\s+$/g, "");
      }

      if (commandArgs[0] === "slash") {
        try {
          // call the command function
          return await commandCenter.setCommandStyle(
            "slash",
            "prefix",
            message
          );
        } catch (error) {
          console.log(error, `Failed Command Style Set Attempt`);
          // Send error embed to the interaction user.
          try {
            return await sendErrorEmbed(message, error, commandName);
          } catch (error) {
            console.log(error, `Failed Error Embed Send Attempt`);
          }
        }
      } else if (commandArgs[0] === "prefix") {
        try {
          // call the command function
          return await commandCenter.setCommandStyle(
            "prefix",
            "prefix",
            message,
            newPrefix
          );
        } catch (error) {
          console.log(error, `Failed Command Style Set Attempt`);
          // Send error embed to the interaction user.
          try {
            return await sendErrorEmbed(message, error, commandName);
          } catch (error) {
            console.log(error, `Failed Error Embed Send Attempt`);
          }
        }
      } else if (commandArgs[0] === "both") {
        try {
          // call the command function
          return await commandCenter.setCommandStyle(
            "both",
            "prefix",
            message,
            newPrefix
          );
        } catch (error) {
          console.log(error, `Failed Command Style Set Attempt`);
          // Send error embed to the interaction user.
          try {
            return await sendErrorEmbed(message, error, commandName);
          } catch (error) {
            console.log(error, `Failed Error Embed Send Attempt`);
          }
        }
      }

      break;

    // kick Command

    case "kick":
      // Check the user for the permissions needed based on the permissions array.
      const userPermissionsKick = message.member.permissions.toArray();

      const userHasPermissionsKick = await permissionsCheck(
        userPermissionsKick,
        permissions,
        message
      );
      if (!userHasPermissionsKick) {
        return;
      }

      // If no arguments are provided, send an embed with the command info.
      if (!commandArgs || commandArgs.length === 0) {
        // Reply to the message with an embed displaying the command info.
        try {
          await message.reply({ embeds: [commandInfoEmbed] });
        } catch (error) {
          console.log(error, `Failed Command Info Reply Attempt`);
          // If the message no longer exists, send the embed to the channel.
          try {
            await message.channel.send({
              text: `<@${message.user.id}>`,
              embeds: [commandInfoEmbed],
            });
          } catch (error) {
            console.log(error, `Failed Command Info Channel Send Attempt`);
          }
        }
        return;
      }

      const user = message.mentions.users.first() || commandArgs[0];
      const trialArg0 = commandArgs[0];
      const reason = commandArgs[1] ? commandArgs[1] : "No reason provided.";

      try {
        return await commandCenter.kick(user, reason, "prefix", message);
      } catch (error) {
        console.log(error, `Failed Kick Attempt`);
        // Send error embed to the interaction user.
        try {
          return await sendErrorEmbed(message, error, commandName);
        } catch (error) {
          console.log(error, `Failed Error Embed Send Attempt`);
        }
      }
      break;

    // ban Command

    default:
  }
}

module.exports = prefixHandler;
