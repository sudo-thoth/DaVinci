const createEmbed = require("./../create/createEmbed.js");
const scripts = require("./scripts.js");
const createBtn = require("./../create/createButton.js");
const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const client = require("./../../index.js");

const discordJsCharMax = {
  embed: {
    footer: {
      text: 2048,
    },
    title: 256,
    description: 2048,
    field: {
      name: 256,
      value: 1024,
    },
    author: {
      name: 256,
    },
  },
};



// function to send a reply message in response to the type of trigger
async function send({trigger, triggerType, triggerUser, messageObject, deferred = false}) {
  switch (triggerType) {  
    case "interaction":
      let updatedTrigger = trigger;
      let failed = false;
      let iMessage = trigger?.message;

    if(deferred){
      try {
         await trigger.editReply(messageObject);
         return { failed: failed, trigger: updatedTrigger}
      } catch (error) {
        
        // try to follow up with a message
        try{
          await trigger.followUp(messageObject);
          return { failed: failed, trigger: updatedTrigger}
        } catch (error) {
          failed = true;
          try {
            updatedTrigger = await iMessage.edit(messageObject);
            return { failed: failed, trigger: updatedTrigger}
          } catch (error) {
        // if error send a message replying to the iMessage message
        try {
          messageObject.content = `<@${triggerUser?.id}>`;
          updatedTrigger = await iMessage.reply(messageObject);
          return { failed: failed, trigger: updatedTrigger}
        } catch (error) {
          console.log(error, `Failed Message Reply Attempt`);
          failed = true;
          // if error send a message to the channel
          try {
            messageObject.content = `<@${triggerUser?.id}>`;
            updatedTrigger = await trigger.channel.send(messageObject);
            return { failed: failed, trigger: updatedTrigger}
          } catch (error) {
            console.log(error, `Failed New Message Attempt`);
            return { failed: failed, trigger: null}
          }
        }
      }
      }

      }
    } else {
      // if not deferred, send a reply to the trigger
      try {
        updatedTrigger = await trigger.reply(messageObject);
        return { failed: failed, trigger: updatedTrigger}
      } catch (error) {
        failed = true;
        try {
          updatedTrigger = await trigger.followUp(messageObject);
          return { failed: failed, trigger: updatedTrigger}
        } catch (error) {
        console.log(error, `Failed Interaction FollowUp Attempt`);
        try {
          updatedTrigger = await iMessage.edit(messageObject);
          return { failed: failed, trigger: updatedTrigger}
        } catch (error) {
          try {
            messageObject.content =  `${messageObject?.content ? `<@${triggerUser?.id}> | ${messageObject?.content}` : `<@${triggerUser?.id}>`}`;
            updatedTrigger = await iMessage.reply(messageObject);
            return { failed: failed, trigger: updatedTrigger}
          } catch (error) {
        // if error send a message to the channel
        try {
          messageObject.content =  `${messageObject?.content ? `<@${triggerUser?.id}> | ${messageObject?.content}` : `<@${triggerUser?.id}>`}`;
          updatedTrigger = await trigger.channel.send(messageObject);
          return { failed: failed, trigger: updatedTrigger}
        } catch (error) {
          console.log(error, `Failed New Message Attempt`);
          return { failed: failed, trigger: null}
        }
      }
    }
      }
    }
    }

    break;

    case "message":

    // try to edit the message
    try {
      updatedTrigger = await trigger.edit(messageObject);
      return { failed: failed, trigger: updatedTrigger}
    } catch (error) {
      failed = true;
      // if error send a message replying to the trigger message
      try {
        messageObject.content =  `${messageObject?.content ? `<@${triggerUser?.id}> | ${messageObject?.content}` : `<@${triggerUser?.id}>`}`;
        updatedTrigger = await trigger.reply(messageObject);
        return { failed: failed, trigger: updatedTrigger}
      } catch (error) {
        console.log(error, `Failed Message Reply Attempt`);
        // if error send a message to the channel
        try {
          messageObject.content =  `${messageObject?.content ? `<@${triggerUser?.id}> | ${messageObject?.content}` : `<@${triggerUser?.id}>`}`;
          updatedTrigger = await trigger.channel.send(messageObject);
          return { failed: failed, trigger: updatedTrigger}
        }
        catch (error) {
          console.log(error, `Failed New Message Attempt`);
          return { failed: failed, trigger: null}
        }
      }
    }

      


    break;

    default:
      failed = true;
      console.log(`Invalid trigger type: ${triggerType}`);
      return { failed: failed, trigger: updatedTrigger}
     

    }
}


let type = (failed) => {
  if(failed === false) return "interaction";
  else return "message";
}


/**
 * Sends an error message and handles the error response based on the trigger type.
 * @param {Object} options - The options for sending the error message.
 * @param {Error} options.error - The error object.
 * @param {string} [options.errorView="short"] - The error view type ("short" or "long").
 * @param {Object} options.trigger - The trigger object.
 * @param {string} options.triggerType - The type of trigger ("interaction" or "message").
 * @param {Object} options.triggerUser - The user who triggered the error.
 * @param {string} options.commandName - The name of the command.
 * @param {string} [options.action=""] - The action being performed when the error occurs.
 * @param {boolean} [options.deferred=false] - Whether the error response should be deferred.
 * @returns {Object} - The result of sending the error message.
 * @returns {boolean} result.failed - Indicates if sending the error message failed.
 * @returns {Object} result.trigger - The updated trigger object.
 */
async function sendError({error, errorView = "short", trigger, triggerType, triggerUser, commandName, action = "", deferred = false}){
  // action is the action that the command is doing when the error occurs
  // errorView can be either short (showing only the error message) or long (showing the error message and the error stack), default is short

  
  // Extract the file name and line number from the error stack
  const errorStack = error.stack || "";
  const stackLines = errorStack.split('\n');
  const errorLocationMatch = /\((.*):\d+:\d+\)/.exec(stackLines[1]);
  const [,, errorFileNameAndLine] = errorLocationMatch || [];
  const [errorFileName, errorLineNumber] = errorFileNameAndLine ? errorFileNameAndLine.split(':') : ['', ''];

  // Log the file name and line number where the error occurred
  console.log(`Error occurred in ${errorFileName}:${errorLineNumber}`);

  // create the error description
  const errorDescription = `${djsEmojis.crossmark} ${commandName !== "" ? `Running **${commandName}** ` : ""} ${action !== "" ? `An error occurred while ${action}. \`${errorFileName}:${errorLineNumber}\`` : "| An Error Occurred \`${errorFileName}:${errorLineNumber}\`"}\n\`\`\`js\n${errorView === "short" ? error?.message : error}\n\`\`\``;
  
  // create the error embed
  const errorEmbed = createEmbed({
      title: `${djsEmojis.exclamationmark} Error Occurred`,
      description: errorDescription,
      color: scripts.getErrorColor(),
      footer: {
          text: client.user.displayName,
          iconURL: client.user.displayAvatarURL()
      }
  });

  // create message object
  const messageObject = { embeds: [errorEmbed] };

 // TODO: Create Log Error Function
 // await logError({trigger: trigger, triggerUser: triggerUser, error: error, commandName: commandName, action: action});

  switch (triggerType) {  
    case "interaction":
      let updatedTrigger = trigger;
      let failed = false;
      let iMessage = trigger?.message;

    if(deferred){
      try {
         updatedTrigger = await trigger.editReply(messageObject);
         return { failed: failed, trigger: updatedTrigger}
      } catch (error) {
        failed = true;
        // try to follow up with a message
        try{
          updatedTrigger = await trigger.followUp(messageObject);
          return { failed: failed, trigger: updatedTrigger}
        } catch (error) {
          try {
            updatedTrigger = await iMessage.edit(messageObject);
            return { failed: failed, trigger: updatedTrigger}
          } catch (error) {
        // if error send a message replying to the iMessage message
        try {
          messageObject.content = `<@${triggerUser?.id}>`;
          updatedTrigger = await iMessage.reply(messageObject);
          return { failed: failed, trigger: updatedTrigger}
        } catch (error) {
          console.log(error, `Failed Message Reply Attempt`);
          failed = true;
          // if error send a message to the channel
          try {
            messageObject.content = `<@${triggerUser?.id}>`;
            updatedTrigger = await trigger.channel.send(messageObject);
            return { failed: failed, trigger: updatedTrigger}
          } catch (error) {
            console.log(error, `Failed New Message Attempt`);
            return { failed: failed, trigger: null}
          }
        }
      }
      }

      }
    } else {
      // if not deferred, send a reply to the trigger
      try {
        updatedTrigger = await trigger.reply(messageObject);
        return { failed: failed, trigger: updatedTrigger}
      } catch (error) {
        failed = true;
        try {
          updatedTrigger = await trigger.followUp(messageObject);
          return { failed: failed, trigger: updatedTrigger}
        } catch (error) {
        console.log(error, `Failed Interaction FollowUp Attempt`);
        try {
          updatedTrigger = await iMessage.edit(messageObject);
          return { failed: failed, trigger: updatedTrigger}
        } catch (error) {
          try {
            messageObject.content =  `${messageObject?.content ? `<@${triggerUser?.id}> | ${messageObject?.content}` : `<@${triggerUser?.id}>`}`;
            updatedTrigger = await iMessage.reply(messageObject);
            return { failed: failed, trigger: updatedTrigger}
          } catch (error) {
        // if error send a message to the channel
        try {
          messageObject.content =  `${messageObject?.content ? `<@${triggerUser?.id}> | ${messageObject?.content}` : `<@${triggerUser?.id}>`}`;
          updatedTrigger = await trigger.channel.send(messageObject);
          return { failed: failed, trigger: updatedTrigger}
        } catch (error) {
          console.log(error, `Failed New Message Attempt`);
          return { failed: failed, trigger: null}
        }
      }
    }
      }
    }
    }

    break;

    case "message":

    // try to edit the message
    try {
      updatedTrigger = await trigger.edit(messageObject);
      return { failed: failed, trigger: updatedTrigger}
    } catch (error) {
      failed = true;
      // if error send a message replying to the trigger message
      try {
        messageObject.content =  `${messageObject?.content ? `<@${triggerUser?.id}> | ${messageObject?.content}` : `<@${triggerUser?.id}>`}`;
        updatedTrigger = await trigger.reply(messageObject);
        return { failed: failed, trigger: updatedTrigger}
      } catch (error) {
        console.log(error, `Failed Message Reply Attempt`);
        // if error send a message to the channel
        try {
          messageObject.content =  `${messageObject?.content ? `<@${triggerUser?.id}> | ${messageObject?.content}` : `<@${triggerUser?.id}>`}`;
          updatedTrigger = await trigger.channel.send(messageObject);
          return { failed: failed, trigger: updatedTrigger}
        }
        catch (error) {
          console.log(error, `Failed New Message Attempt`);
          return { failed: failed, trigger: null}
        }
      }
    }

      


    break;

    default:
      failed = true;
      console.log(`Invalid trigger type: ${triggerType}`);
      return { failed: failed, trigger: updatedTrigger}
     

    }

}



/**
 * Function to handle and report errors in interactions.
 *
 * @param {string} action - The action that was being performed when the error occurred.
 * @param {DiscordInteraction} interaction - The Discord interaction where the error occurred.
 * @param {Error} err - The error that occurred.
 * @param {DiscordInteraction} i - (Optional) An alternative interaction to report the error (used in certain cases).
 */
async function throwNewError(action, interaction, err, i) {
  try {
    const errorEmbed = createEmbed({
      title: "❗️ There was an Error, Share the Error with the Developer",
      description: `__While:__ \`${
        action ?? "?"
      }\`\n\`\`\`js\n${err}\n\`\`\`\nError Report Summary:\n\`\`\`js\nusername: ${
        interaction.member.user.username
      }\nID: ${interaction.member.user.id}\nGuild: ${
        interaction.guild.name
      }\nGuild ID: ${interaction.guild.id}\nChannel: ${
        interaction.channel.name
      }\nChannel ID: ${interaction.channel.id}\nMessage ID: ${
        interaction.message?.id ?? "N/A"
      }\nButton ID: ${interaction.customID ?? "N/A"}\n\`\`\``,
      color: scripts.getErrorColor(),
      footer: {
        text: "Contact The Developer and Send the Error",
        iconURL: interaction.user.avatarURL(),
      },
    });

    await interaction.editReply({
      embeds: [errorEmbed],
    });
  } catch (error) {
    if (i) {
      try {
        const errorEmbedAlt = createEmbed({
          title: "There was an Error, Share the Error with the Developer",
          description: `\`\`\`js\n${err}\n\`\`\`\nError Report Summary:\n\`\`\`js\nusername: ${
            i.member.user.username
          }\nID: ${i.member.user.id}\nGuild: ${i.guild.name}\nGuild ID: ${
            i.guild.id
          }\nChannel: ${i.channel.name}\nChannel ID: ${
            i.channel.id
          }\nMessage ID: ${i.message?.id ?? "N/A"}\nButton ID: ${
            i.customID ?? "N/A"
          }\n\`\`\``,
          color: scripts.getErrorColor(),
          footer: {
            text: "Contact The Developer and Send the Error",
            iconURL: i.user.avatarURL(),
          },
        });

        await i.editReply({
          embeds: [errorEmbedAlt],
        });
      } catch (errr) {
        console.log(
          `An error occurred when trying to send the user the error: ${err}\n\nAn error occurred when trying to send the user the error the second time: ${error}\n\nAn error occurred when trying to send the user the error the third time: ${errr}`
        );
      }
    } else {
      const errorEmbedDefault = createEmbed({
        title: "There was an Error, Share the Error with the Developer",
        description: `${
          interaction.commandName
            ? `Command: \`${interaction.commandName}\`\n`
            : ""
        }\`\`\`js\n${err}\n\`\`\`Error occurred for admin user:\n\`\`\`js\nusername: ${
          interaction.member.user.username
        }\nID: ${interaction.member.user.id}\nGuild: ${
          interaction.guild.name
        }\nGuild ID: ${interaction.guild.id}\nChannel: ${
          interaction.channel.name
        }\nChannel ID: ${interaction.channel.id}${
          interaction.message ? `\nMessage ID: ${interaction.message.id}` : ""
        }${
          interaction.customID ? `\nCustom ID: ${interaction.customID}` : ""
        }\n\`\`\``,
        color: scripts.getErrorColor(),
        footer: {
          text: "Contact The Developer and Send the Error",
          iconURL: interaction.user.avatarURL(),
        },
      });

      await interaction.editReply({
        embeds: [errorEmbedDefault],
      });
    }
  }
}

/**
 * Create an attachment using an attachment object.
 *
 * @param {Attachment} attachment - The attachment object with filename and URL.
 * @returns {AttachmentBuilder} An instance of AttachmentBuilder.
 */
function createAttachment(attachment) {
  return new AttachmentBuilder()
    .setName(attachment.filename)
    .setFile(attachment.url);
}

/**
 * Get a random alert emoji from a predefined list.
 *
 * @returns {string} A randomly selected alert emoji.
 */
let getAlertEmoji = () => {
  let alertEmojis = [
    `🫵🏿`,
    `🛎️`,
    `📬`,
    `💌`,
    `🆕`,
    `🔔`,
    `📣`,
    `📢`,
    `📳`,
    `🪬`,
  ];
  let random = Math.floor(Math.random() * alertEmojis.length);
  return alertEmojis[random];
};

/**
 * Returns an object with information about the member.
 *
 * @param {Object} member - The member object from which to get the information
 *
 * @returns {Object} An object with information about the member.
 *
 * @throws {Error} If there is an error getting the information or if the member is not an object
 */
function getMemberInfoObj(member) {
  let obj;
  // Check to make sure the member is an object
  if (typeof member !== "object") {
    try {
      throw new Error("The member is not an object");
    } catch (error) {
      scripts.logError(error);
    }
  } else {
    try {
      obj = {
        // Get the user name of the user who triggered the interaction
        name: `${member.user.username}`,
        displayName: `${member.displayName}`,
        // Get the user id of the user who triggered the interaction
        userId: `${member.user.id}`,
        // Get the user avatar of the user who triggered the interaction
        avatar: `${member.user.avatarURL()}`,
        // Get the user role of the user who triggered the interaction
        role: `${member.roles.highest.name}`,
        // Get the date the user joined the server
        joined: `${member.joinedAt}`,
        // Get the date the user joined Discord
        created: `${member.user.createdAt}`,
        // Get the number of times the user has been kicked
        kicks: `${member.user.kicks === undefined ? 0 : member.user.kicks}`,
        // Get the number of times the user has been banned
        bans: `${member.user.bans === undefined ? 0 : member.user.bans}`,
        // Get the number of times the user has been warned
        warns: `${member.user.warns === undefined ? 0 : member.user.warns}`,
      };
      return obj;
    } catch (error) {
      scripts.logError(error, "Error creating member object");
    }
  }
}

/**
 * Returns a string of a bulleted list of every command found.
 *
 * @param {Object} client - The client object from which to get the commands.
 * @param {string[]} exclude - An array of command names to exclude from the list.
 *
 * @returns {string} A string of a bulleted list of commands.
 *
 * @throws {Error} If there is an error getting the commands.
 *
 * @example
 * getCommands(client, ['command1', 'command2']); // returns a string of a bulleted list of commands except 'command1' and 'command2'
 */
function getCommands(client, exclude = []) {
  try {
    // Get the commands array from the client object.
    const commands = client.commands;
    // Initialize a variable to store the string of the bulleted list.
    let listString = "";
    // Iterate through the commands array and for each command, append a string to listString that consists of a bullet point and the command name.
    commands.forEach((command) => {
      if (!exclude.includes(command.data.name)) {
        listString += "\n- `/" + `${command.data.name}` + "`";
      }
    });
    // Return the listString variable.
    return listString;
  } catch (error) {
    // Log the error message and a descriptive message using the logError function.
    scripts.logError(error, "Error getting commands");
  }
}

/**
 * Returns an object with information about the interaction.
 *
 * @param {Object} interaction - The interaction object from which to get the information.
 *
 * @returns {Object} An object with information about the interaction.
 *
 * @throws {Error} If there is an error getting the information or if the interaction is not an object.
 */
function getInteractionObj(interaction) {
  // Check to make sure the interaction is an object.
  if (typeof interaction !== "object") {
    try {
      throw new Error("The interaction is not an object");
    } catch (error) {
      scripts.logError(error);
    }
  } else {
    try {
      let obj = {
        id: `${interaction.id}`,
        customID: `${interaction.customId}`,
        channel: `${interaction.channel}`,
        guild: `${interaction.guild}`,
        member: `${interaction.member}`, // ex: <@975944168373370940> (user id) not an object
        memberPerms: `${interaction.member.permissions}`, // ex:
        userInfo: {
          // Get the user name of the user who triggered the interaction.
          name: `${interaction.member.user.username}`,
          displayName: `${interaction.member.displayName}`,
          // Get the user id of the user who triggered the interaction.
          userId: `${interaction.member.user.id}`,
          // Get the user avatar of the user who triggered the interaction.
          avatar: `${interaction.member.user.avatarURL()}`,
          // Get the user role of the user who triggered the interaction.
          role: `${interaction.member.roles.highest.name}`,
          // Get the user role id of the user who triggered the interaction.
          roleID: `${interaction.member.roles.highest.id}`,
          // Get the array of roles the user who triggered the interaction has.
          roles: interaction.member.roles,
        },
      };
      return obj;
    } catch (error) {
      scripts.logError(error, "Error creating interaction object");
    }
  }
}

/**
 * Extracts an ID from a string that contains a "#" symbol.
 *
 * @param {string} str - The input string to extract the ID from.
 *
 * @returns {string | undefined} The extracted ID or undefined if the input is invalid.
 *
 * @throws {Error} If the input string does not contain a "#" symbol.
 */
function extractID(str) {
  // Check if the input string is undefined.
  if (str === undefined) return;

  console.log(`THE STRING:`, str);

  // Check if the input string contains a "#" symbol.
  if (str.includes("#")) {
    // Split the string at "#" and get the second part as the ID.
    let id = `#${str.split("#")[1]}`;
    return id;
  } else {
    try {
      // Throw an error if the string does not contain a "#" symbol.
      throw new Error("The string does not contain a #");
    } catch (error) {
      // Log the error using the logError function.
      scripts.logError(error, str);
    }
  }
}

/**
 * Create a link-style button with a label and URL.
 *
 * @param {string} label - The label or text displayed on the button.
 * @param {string} url - The URL that the button links to.
 *
 * @returns {Object} A button object with link style.
 */
const linkButton = (label, url) => {
  // Create a button using the createButton function.
  let button = createBtn.createButton({
    link: url,
    label: label,
    style: "link",
  });
  return button;
};

/**
 * Create an error embed with a specific format.
 *
 * @returns {Object} An embed object with error information.
 */
let errEmbed = () => {
  return new EmbedBuilder()
    .setColor("#FF0000")
    .setTitle("❗️ Error")
    .setDescription("Invalid properties were given to create the embed");
};

/**
 * Get the count of online members in the server.
 *
 * @param {Object} interaction - The interaction object to access the server information.
 * @returns {number} The count of online members.
 */
let getOnlineCount = async (interaction) => {
  let onlineCount = 0;

  // Fetch all members in the guild
  const cache = await interaction.guild.members.fetch();
  // Filter the fetched members to count those with 'online' status
  let fetchedMembers = cache.filter(
    (member) => member.presence?.status === "online"
  );
  onlineCount = fetchedMembers.size;
  return onlineCount;
};

/**
 * Get the count of offline members in the server.
 *
 * @param {Object} interaction - The interaction object to access the server information.
 * @returns {number} The count of offline members.
 */
let getOfflineCount = (interaction) => {
  let offlineCount = 0;

  // Fetch all members with presences
  interaction.guild.members
    .fetch({ withPresences: true })
    .then((fetchedMembers) => {
      // Filter the fetched members to count those with 'offline' status
      const totalOffline = fetchedMembers.filter(
        (member) => member.presence?.status === "offline"
      );
      offlineCount = totalOffline.size;
    });

  return offlineCount;
};

/**
 * Get the count of members with 'idle' status in the server.
 *
 * @param {Object} interaction - The interaction object to access the server information.
 * @returns {number} The count of members with 'idle' status.
 */
let getIdleCount = (interaction) => {
  let idleCount = 0;

  // Fetch all members with presences
  interaction.guild.members
    .fetch({ withPresences: true })
    .then((fetchedMembers) => {
      // Filter the fetched members to count those with 'idle' status
      const totalIdle = fetchedMembers.filter(
        (member) => member.presence?.status === "idle"
      );
      idleCount = totalIdle.size;
    });

  return idleCount;
};

/**
 * Get the count of members with 'dnd' (Do Not Disturb) status in the server.
 *
 * @param {Object} interaction - The interaction object to access the server information.
 * @returns {number} The count of members with 'dnd' status.
 */
let getDndCount = (interaction) => {
  let dndCount = 0;

  // Fetch all members with presences
  interaction.guild.members
    .fetch({ withPresences: true })
    .then((fetchedMembers) => {
      // Filter the fetched members to count those with 'dnd' status
      const totalDnd = fetchedMembers.filter(
        (member) => member.presence?.status === "dnd"
      );
      dndCount = totalDnd.size;
    });

  return dndCount;
};

/**
 * Get the count of bot members in the server.
 *
 * @param {Object} interaction - The interaction object to access the server information.
 * @returns {number} The count of bot members.
 */
let getBotCount = (interaction) => {
  let botCount = 0;

  // Fetch all members with presences
  interaction.guild.members
    .fetch({ withPresences: true })
    .then((fetchedMembers) => {
      // Filter the fetched members to count those that are bots
      const totalBots = fetchedMembers.filter((member) => member.user.bot);
      botCount = totalBots.size;
    });

  return botCount;
};

/**
 * Get the count of human members in the server.
 *
 * @param {Object} interaction - The interaction object to access the server information.
 * @returns {number} The count of human members.
 */
let getHumanCount = (interaction) => {
  let humanCount = 0;

  // Fetch all members with presences
  interaction.guild.members
    .fetch({ withPresences: true })
    .then((fetchedMembers) => {
      // Filter the fetched members to count those that are not bots
      const totalHumans = fetchedMembers.filter((member) => !member.user.bot);
      humanCount = totalHumans.size;
    });

  return humanCount;
};

/**
 * Get the count of online human members in the server.
 *
 * @param {Object} interaction - The interaction object to access the server information.
 * @returns {number} The count of online human members.
 */
let getOnlineHumans = (interaction) => {
  let onlineHumans = 0;

  // Fetch all members with presences
  interaction.guild.members
    .fetch({ withPresences: true })
    .then((fetchedMembers) => {
      // Filter the fetched members to count those that are online and not bots
      const totalOnlineHumans = fetchedMembers.filter(
        (member) => member.presence?.status === "online" && !member.user.bot
      );
      onlineHumans = totalOnlineHumans.size;
    });

  return onlineHumans;
};

/**
 * Get the count of online bot members in the server.
 *
 * @param {Object} interaction - The interaction object to access the server information.
 * @returns {number} The count of online bot members.
 */
let getOnlineBots = (interaction) => {
  let onlineBots = 0;

  // Fetch all members with presences
  interaction.guild.members
    .fetch({ withPresences: true })
    .then((fetchedMembers) => {
      // Filter the fetched members to count those that are online and are bots
      const totalOnlineBots = fetchedMembers.filter(
        (member) => member.presence?.status === "online" && member.user.bot
      );
      onlineBots = totalOnlineBots.size;
    });

  return onlineBots;
};

/**
 * Get the count of offline human members in the server.
 *
 * @param {Object} interaction - The interaction object to access the server information.
 * @returns {number} The count of offline human members.
 */
let getOfflineHumans = (interaction) => {
  let offlineHumans = 0;

  // Fetch all members with presences
  interaction.guild.members
    .fetch({ withPresences: true })
    .then((fetchedMembers) => {
      // Filter the fetched members to count those that are offline and not bots
      const totalOfflineHumans = fetchedMembers.filter(
        (member) => member.presence?.status === "offline" && !member.user.bot
      );
      offlineHumans = totalOfflineHumans.size;
    });

  return offlineHumans;
};

/**
 * Get the count of offline bot members in the server.
 *
 * @param {Object} interaction - The interaction object to access the server information.
 * @returns {number} The count of offline bot members.
 */
let getOfflineBots = (interaction) => {
  let offlineBots = 0;

  // Fetch all members with presences
  interaction.guild.members
    .fetch({ withPresences: true })
    .then((fetchedMembers) => {
      // Filter the fetched members to count those that are offline and are bots
      const totalOfflineBots = fetchedMembers.filter(
        (member) => member.presence?.status === "offline" && member.user.bot
      );
      offlineBots = totalOfflineBots.size;
    });

  return offlineBots;
};

/**
 * Get the count of all non-bot members in the server.
 *
 * @param {Object} interaction - The interaction object to access the server information.
 * @returns {number} The count of non-bot members.
 */
let getMemberCount = (interaction) => {
  let memberCount = 0;

  // Fetch all members with presences
  interaction.guild.members
    .fetch({ withPresences: true })
    .then((fetchedMembers) => {
      // Filter the fetched members to count those that are not bots
      const totalMembers = fetchedMembers.filter((member) => !member.user.bot);
      memberCount = totalMembers.size;
    });

  return memberCount;
};

/**
 * Get server information as an object, including member counts and status counts.
 *
 * @param {Object} interaction - The interaction object to access server information.
 * @returns {Object} An object containing various server-related counts.
 */
let getServerInfoObj = (interaction) => {
  let serverInfoObj = {
    onlineCount: getOnlineCount(interaction),
    offlineCount: getOfflineCount(interaction),
    idleCount: getIdleCount(interaction),
    dndCount: getDndCount(interaction),
    botCount: getBotCount(interaction),
    humanCount: getHumanCount(interaction),
    onlineHumans: getOnlineHumans(interaction),
    onlineBots: getOnlineBots(interaction),
    offlineHumans: getOfflineHumans(interaction),
    offlineBots: getOfflineBots(interaction),
    memberCount: getMemberCount(interaction),
  };

  return serverInfoObj;
};

/**
 * Generate a random ID based on the current date and time.
 *
 * @returns {string} A unique random ID.
 */
let getRandID = () => {
  let randID = "";
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  let millisecond = date.getMilliseconds();
  randID = `#${
    Math.floor(Math.random() * 999) + 999
  }${year}${month}${day}${hour}${minute}${second}${millisecond}`;
  return randID;
};

/**
 * Asynchronously handles and replies to errors by sending an error message to the user or channel.
 *
 * @param {Object} obj - An object containing relevant information for error handling and reporting.
 */
async function throwErrorReply(obj) {
  let { interaction, error, action, interaction2 } = obj;

  // Check if essential parameters are provided
  if (!interaction || !error) return;

  console.log("New Error Sent In Server\n\n", error);

  try {
    // Attempt to edit the reply with an error message embed
    await interaction.editReply({
      embeds: [
        createEmbed({
          title: "❗️ There was an Error , Share the Error w the Developer",
          description:
            `__**While :**__ **\`${
              action !== null ? action : "? : no action inputted"
            }\`**\n` +
            `${
              interaction.commandName
                ? `Command: \`${interaction.commandName}\`\n`
                : ""
            }` +
            "```js\n" +
            error +
            "\n```\n" +
            `Error Report Summary:` +
            "\n```js\n" +
            `username: ${interaction.member.user.username}\nID: ${
              interaction.member.user.id
            }\nGuild: ${interaction.guild.name}\nGuild ID: ${
              interaction.guild.id
            }\nChannel Name: ${interaction.channel.name}\nChannel ID: ${
              interaction.channel.id
            }\nMessage ID: ${interaction.message.id}\nMessage Content: ${
              interaction.message.content
            }\nCustom ID: ${interaction.customId}\nTimestamp: ${new Date()}` +
            "\n```",
          color: scripts.getErrorColor(),
          footer: {
            text: "Contact The Developer and Send the Error",
            iconURL: interaction.user
              ? interaction.user.avatarURL()
              : interaction.client.user.avatarURL(),
          },
        }),
      ],
    });
  } catch (err) {
    if (interaction2) {
      try {
        // Attempt to edit the reply with an error message embed, including information about the original error
        await interaction2.editReply({
          embeds: [
            createEmbed({
              title: "❗️ There was an Error , Share the Error w the Developer",
              description:
                `ORIGINAL ERROR\n\n__**While :**__ **\`${
                  action !== null ? action : "? : no action inputted"
                }\`**\n` +
                `${
                  interaction.commandName
                    ? `Command: \`${interaction.commandName}\`\n`
                    : ""
                }` +
                "```js\n" +
                error +
                "\n```\n" +
                `Error Report Summary:` +
                "\n```js\n" +
                `username: ${interaction.member.user.username}\nID: ${
                  interaction.member.user.id
                }\nGuild: ${interaction.guild.name}\nGuild ID: ${
                  interaction.guild.id
                }\nChannel Name: ${interaction.channel.name}\nChannel ID: ${
                  interaction.channel.id
                }\nMessage ID: ${interaction.message.id}\nMessage Content: ${
                  interaction.message.content
                }\nCustom ID: ${
                  interaction.customId
                }\nTimestamp: ${new Date()}` +
                "\n```" +
                `\n\nAdditional ERROR\n\n__**While :**__ **\`sending the original error message\`**\n` +
                "```js\n" +
                err +
                "\n```\n" +
                `Error Report Summary:` +
                "\n```js\n" +
                `username: ${interaction2.member.user.username}\nID: ${
                  interaction2.member.user.id
                }\nGuild: ${interaction2.guild.name}\nGuild ID: ${
                  interaction2.guild.id
                }\nChannel Name: ${interaction2.channel.name}\nChannel ID: ${
                  interaction2.channel.id
                }\nMessage ID: ${interaction2.message.id}\nMessage Content: ${
                  interaction2.message.content
                }\nCustom ID: ${
                  interaction2.customId
                }\nTimestamp: ${new Date()}` +
                "\n```",
              color: scripts.getErrorColor(),
              footer: {
                text: "Contact The Developer and Send the Error",
                iconURL: interaction.user
                  ? interaction.user.avatarURL()
                  : interaction2.user
                  ? interaction2.user.avatarURL()
                  : interaction.client.user.avatarURL(),
              },
            }),
          ],
        });
      } catch (errr) {
        console.log(
          `Error occurred when trying to send the user this-> Error: ${error}\n\n\nThe error that occurred when trying to send the user the 2nd time -> error is: ${err}\n\n\nThe error that occurred when trying to send the user the 3rd time -> error is: ${errr}`
        );
      }
    } else {
      try {
        // If interaction2 is not provided, send the error message to the channel
        await interaction.channel.send({
          embeds: [
            createEmbed({
              title: "❗️ There was an Error , Share the Error w the Developer",
              description:
                `ORIGINAL ERROR\n\n__**While :**__ **\`${
                  action !== null ? action : "? : no action inputted"
                }\`**\n` +
                `${
                  interaction.commandName
                    ? `Command: \`${interaction.commandName}\`\n`
                    : ""
                }` +
                "```js\n" +
                error +
                "\n```\n" +
                `Error Report Summary:` +
                "\n```js\n" +
                `username: ${interaction.member.user.username}\nID: ${
                  interaction.member.user.id
                }\nGuild: ${interaction.guild.name}\nGuild ID: ${
                  interaction.guild.id
                }\nChannel Name: ${interaction.channel.name}\nChannel ID: ${
                  interaction.channel.id
                }\nMessage ID: ${interaction.message.id}\nMessage Content: ${
                  interaction.message.content
                }\nCustom ID: ${
                  interaction.customId
                }\nTimestamp: ${new Date()}` +
                "\n```" +
                `\n\nAdditional ERROR\n\n__**While :**__ **\`sending the original error message\`**\n` +
                "```js\n" +
                err +
                "\n```\n" +
                `Error Report Summary:` +
                "\n```js\n" +
                `username: ${interaction.member.user.username}\nID: ${
                  interaction.member.user.id
                }\nGuild: ${interaction.guild.name}\nGuild ID: ${
                  interaction.guild.id
                }\nChannel Name: ${interaction.channel.name}\nChannel ID: ${
                  interaction.channel.id
                }\nMessage ID: ${interaction.message.id}\nMessage Content: ${
                  interaction.message.content
                }\nCustom ID: ${
                  interaction.customId
                }\nTimestamp: ${new Date()}` +
                "\n```",
              color: scripts.getErrorColor(),
              footer: {
                text: "Contact the Developer and Send the Error",
                iconURL: interaction.user
                  ? interaction.user.avatarURL()
                  : interaction.client.user.avatarURL(),
              },
            }),
          ],
        });
      } catch (errr) {
        console.log(
          `Error occurred when trying to send the user this-> Error: ${error}\n\n\nThe error that occurred when trying to send the user the 2nd time -> error is: ${err}\n\n\nThe error that occurred when trying to send the user the 3rd time -> error is: ${errr}`
        );
      }
    }
  }
}

/**
 * Sends a backup reply message to a specified channel in a guild.
 * 
 * @param {Object|string} guild - The guild object or name/id of the guild.
 * @param {Object|string} channel - The channel object or name/id of the channel.
 * @param {Object|string} user - The user object or display name/id of the user.
 * @param {Object} messageObject - The message object containing the text to send.
 * @param {string} [additionalText=''] - Additional text to append to the message.
 * @returns {Promise<Object>} - A promise that resolves to the sent message object or an error message.
 */
async function backupReplyInChannel(guild, channel, user, messageObject, additionalText = ''){
  let messageText = '';
  // check for invalid guild
  if(typeof guild !== 'object'){
      if(typeof guild === 'string'){
          guild = client.guilds.cache.find(g => g.name === guild || g.id === guild);
          if(!guild){
              return console.log(`Guild not found`)
          }
      } else{
          return console.log(`Guild is not an object`)
      }

  } else {
      if(!guild.id){
          return console.log(`Guild is not an object`)
      }
  }
  // check for invalid channel
  if(typeof channel !== 'object'){
      if(typeof channel === 'string'){
          channel = trigger.guild.channels.cache.find(c => c.name === channel || c.id === channel);
          if(!channel){
              return console.log(`Channel not found`)
          }
      } else{
       return console.log(`Channel is not an object`)
      }
  } else if(channel?.id?.length > 0){
      // search for the channel in the guild
      channel = guild.channels.cache.find(c => c.id === channel.id);
      if(!channel){
          return console.log(`Channel not found`)
      }
      } else {
          return console.log(`Channel is not a valid object`)
      }
      // check for invalid user
      if(typeof user !== 'object'){
          if(typeof user === 'string'){
              user = guild.members.cache.find(m => m.displayName === user || m.id === user);
              if(!user){
                  return console.log(`User not found`)
              }
          } else{
              return console.log(`User is not an object`)
          }
          return console.log(`User is not an object`)
      } else if(user?.id?.length > 0){
          // search for the user in the guild
          user = guild.members.cache.find(m => m.id === user.id);
          if(!user){
              return console.log(`User not found`)
          }
      
  }  else {
      return console.log(`User is not a valid object`)
  }
  // check for invalid messageObject
  if(typeof messageObject !== 'object'){
          return console.log(`MessageObject is not an object`)
  }
  
  if(messageObject?.text?.length > 0){
      messageText = messageObject?.text + `${additionalText ? `\n${additionalText}` : ''}`;
  } else {
      messageText = additionalText;
  }

  if(!user?.id){
    return console.log(`User not found`)
}

  const pingText = `<@${user.id}>`;
  if(messageText !== ''){
      messageText = pingText + ` | ${messageText}`;
  } else {
      messageText = pingText;
  }

  
  messageObject.text = messageText;

  // send the backup message to the channel
  try {
      return await channel.send(messageObject);
  } catch (error) {
      const errorEmbed = createEmbed({
          title: `Error Sending Message`,
          description: `${djsEmojis.crossmark} I was unable to send the message to the channel (<#${channel.id}>).\n\n**Error:**\`\`\`js\n${error}\n\`\`\``,
          color: scripts.getErrorColor(),
          footer: {
              text: client.user.displayName,
              iconURL: client.user.displayAvatarURL()
          }
      });

      // send the error message to the channel
      try {
          return await channel.send({ text: pingText, embeds: [errorEmbed] });
      } catch (error) {
          console.log(error, `Failed to send error message to channel`);
      }
      
  }

}

module.exports = {
  backupReplyInChannel,
  throwErrorReply,
  getRandID,
  getInteractionObj,
  getMemberInfoObj,
  getCommands,
  extractID,
  errEmbed,
  getOnlineCount,
  getOfflineCount,
  getIdleCount,
  getDndCount,
  getBotCount,
  getHumanCount,
  getOnlineHumans,
  getOnlineBots,
  getOfflineHumans,
  getOfflineBots,
  getMemberCount,
  getServerInfoObj,
  getAlertEmoji,
  createAttachment,
  discordJsCharMax,
  throwNewError,
  send,
  sendError,
  type
};