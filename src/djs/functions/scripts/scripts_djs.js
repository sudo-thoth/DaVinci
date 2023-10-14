const createEmb = require("../create/createEmbed.js");
const scripts = require("../scripts/scripts.js");
const createBtn = require("../create/createButton.js");
const {
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");


module.exports = {
  throwErrorReply,
  getRandID,
  getInteractionObj,
  getMemberInfoObj,
  getCommands,
  krakenWebScraper,
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
  krakenFileSizeFinder,
  krakenTitleFinder,
  createAttachment,
  krakenFileTypeFinder,
  discordJsCharMax,
};



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
  }
}

function extractM4Aurl(str) {
  let res = str.match(/m4a:(.*)/);

  return res && res[1];
}

async function throwNewError(
  action = action && typeof action === "string" ? action : null,
  interaction,
  err,
  i
) {
  try {
    await interaction.editReply({
      embeds: [
        createEmb.createEmbed({
          title: "❗️ There was an Error , Share the Error w the Developer",
          description:
            `__While :__ \`${action !== null ? action : "?"}\`\n` +
            "```js\n" +
            err +
            "\n```\n" +
            `Error Report Summary:` +
            "\n```js\n" +
            `username: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}` +
            "\n```",
          color: scripts.getErrorColor(),
          footer: {
            text: "Contact STEVE JOBS and Send the Error",
            iconURL: interaction.user.avatarURL(),
          },
        }),
      ],
    });
  } catch (error) {
    if (i) {
      try {
        await i.editReply({
          embeds: [
            createEmb.createEmbed({
              title: "There was an Error , Share the Error w the Developer",
              description:
                "```js\n" +
                err +
                "\n```\n" +
                `Error Report Summary:` +
                "\n```js\n" +
                `username: ${i.member.user.username}\nID: ${i.member.user.id}\nGuild: ${i.guild.name}\nGuild ID: ${i.guild.id}\nChannel: ${i.channel.name}\nChannel ID: ${i.channel.id}\nMessage ID: ${i.message.id}\nButton ID: ${i.customID}` +
                "\n```",
              color: scripts.getErrorColor(),
              footer: {
                text: "Contact STEVE JOBS and Send the Error",
                iconURL: i.user.avatarURL(),
              },
            }),
          ],
        });
      } catch (errr) {
        console.log(
          `error occurred when trying to send the user this-> Error: ${err}\n\n\nThe error that occurred when trying to send the user the 2nd time -> error is: ${error}\n\n\nThe error that occurred when trying to send the user the 3rd time -> error is: ${errr}`
        );
      }
    } else {
      await interaction.editReply({
        embeds: [
          createEmb.createEmbed({
            title: "There was an Error, Share the Error w the Developer",
            description:
              `${
                interaction.commandName
                  ? `Command: \`${interaction.commandName}\`\n`
                  : ""
              }` +
              "```js\n" +
              err +
              "\n```\n" +
              `Error occurred for admin user:` +
              "\n```js\n" +
              `username: ${interaction.member.user.username}\nID: ${
                interaction.member.user.id
              }\nGuild: ${interaction.guild.name}\nGuild ID: ${
                interaction.guild.id
              }\nChannel: ${interaction.channel.name}\nChannel ID: ${
                interaction.channel.id
              }${
                interaction.message
                  ? `\nMessage ID: ${interaction.message.id}`
                  : ""
              }${
                interaction.customID
                  ? `\nCustom ID: ${interaction.customID}`
                  : ""
              }` +
              "\n```",
            color: scripts.getErrorColor(),
            footer: {
              text: "Contact STEVE JOBS and Send the Error",
              iconURL: interaction.user.avatarURL(),
            },
          }),
        ],
      });
    }
  }
}

function createAttachment(attachment) {
  return new AttachmentBuilder()
.setName(attachment.filename)
.setFile(attachment.url)
// , interaction.setDescription(attachment.description)
}


async function getZIP(parsedData, interaction){
  const capturedValues = parsedData.match(/<(?=form|input).+/g).flatMap(str => str.match(/(?<=["'])[\/\w]+(?=["'])/g));
  // await interaction.channel.send({content: `<@873576476136575006>`, embeds: [createEmb.createEmbed({title: `The Captured Values are:`, description: `capturedValues[0].match(/(?<=\/)\w+$/):\`\`\`js\n${capturedValues[0].match(/(?<=\/)\w+$/)}\n\`\`\`\n\ncapturedValues[0:\`\`\`js\n${capturedValues[0]}\n\`\`\``, color: `#00ff00`})]
  // });
  let theURL = (await (await fetch(`https://krakenfiles.com${capturedValues[0]}`, {
    method: capturedValues[1],
    headers: {
        "accept": "*/*",
        "accept-encoding": "gzip, deflate, br",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "hash": capturedValues[0].match(/(?<=\/)\w+$/).toString()
    },
    body: `${capturedValues[3]}=${capturedValues[4]}`
})).json()).url;
console.log(`theURL`, theURL)

  return theURL;

}
async function krakenZipFinder(url, interaction) {
  
 let data;
  try {
    data = await (await fetch(url)).text();
    // await interaction.channel.send({content: `<@873576476136575006>\n\n\`\`\`js\n${data}\n\`\`\``, embeds: [createEmb.createEmbed({title: `The HTML FIle:`, color: `Yellow`})
   // ]});
   scripts.cLog(data)
  } catch (error) {
    console.log(`there is no data to scrape at this url: ${url}`)
    console.log(`error`, error)
    return;
  }
  let zip;
  try {
    zip = await getZIP(data, interaction)
  
    console.log(`the Zip file`, zip)
  
    return zip
  } catch (error) {
    await throwNewError("scraping kraken zip file", interaction, error)
  }

}

async function krakenFileSizeFinder(url, interaction){
  if (typeof url !== 'string') return;

  let data;
  try {
    data = await (await fetch(url)).text();
  } catch (error) {
    await throwNewError(`there is no data to scrape at this url: ${url}`, interaction, error)
    return;
  }
  const regex = /<div class="sub-text">File size<\/div>\n\s*<div class="lead-text">(.+)<\/div>/;
const match = data.match(regex);
let fileSize = 0;
if (match) {
fileSize = match[1];
console.log(fileSize);
} else {
try {
throw new Error('Could not find kraken file size');
} catch (error) {
await throwNewError("scraping kraken file size", interaction, error)

}
}
  return fileSize;
};

async function krakenFileTypeFinder(url, interaction){
  if (typeof url !== 'string' || url.includes('cdn.discordapp.com')) return;
  console.log(`the url passed in`, url)
  let data;
  try {
    data = await (await fetch(url)).text();
  } catch (error) {
    await throwNewError(`there is no data to scrape at this url: ${url}`, interaction, error)
    return;
  }
  const regex = /<div class="sub-text">Type<\/div>\n\s*<div class="lead-text">(.+)<\/div>/;
const match = data.match(regex);
let type;
if (match) {
  type = match[1];
console.log(type);
} else {
try {
throw new Error('Could not find kraken file type');
} catch (error) {
await throwNewError("file type retrieval", interaction, error)

}
}
  return type;
};

async function krakenFileIsZip(url, interaction){
  if (typeof url !== 'string') return;

  let data;
  try {
    data = await (await fetch(url)).text();
  } catch (error) {
    await throwNewError(`there is no data to scrape at this url: ${url}`, interaction, error)
    return;
  }
  const regex = /<div class="sub-text">Type<\/div>\n\s*<div class="lead-text">(.+)<\/div>/;
const match = data.match(regex);
let type;
if (match) {
  type = match[1];
console.log(type);
} else {
try {
throw new Error('Could not find kraken file type');
} catch (error) {
await throwNewError("file type retrieval", interaction, error)

}
}
  return type;
};

async function krakenTitleFinder(url, interaction){
  if (typeof url !== 'string') return;

  let data;
  try {
    data = await (await fetch(url)).text();
  } catch (error) {
    console.log(`there is no data to scrape at this url: ${url}`)
    console.log(`error`, error)
    return;
  }

try {
    const titleLine = data.split("\n").filter((line) => line.includes(`<meta property="og:title" content=`))[0];
    const matches = titleLine.match(/content="(.*)"/);
    const fileName = matches[1];
  
    return fileName;
} catch (error) {
  await throwNewError(`there is no data to scrape at this url: ${url}`, interaction, error)
  
}

};

async function krakenWebScraper(url, batch_id, interaction){
  if (typeof url !== 'string') return;

  let data;
  try {
    data = await (await fetch(url)).text();
  } catch (error) {
    console.log(`there is no data to scrape at this url: ${url}`)
    console.log(`error`, error)
    return;
  }
  let fileName;
  let type = await krakenFileTypeFinder(url, interaction);
  let x;
  if (type === 'mp3') {
    
    const tempLine = data.split("\n").filter((line) => line.includes("m4a:"))[0];
    const titleLine = data.split("\n").filter((line) => line.includes(`<meta property="og:title" content=`))[0];
    const matches = titleLine.match(/content="(.*)"/);
    fileName = matches[1];
  console.log(`the url line`, tempLine);
  x = extractM4Aurl(tempLine);
  x = x.replace(/'/g, '').replace('//', '');
  // replace all spaces inthe string
  x = x.replace(/ /g, '');
  x= `https://` + x;
  } else if (type === 'zip') {
    fileName = await krakenTitleFinder(url, interaction);
    x = await krakenZipFinder(url, interaction)
    //x= url;
  }
saveKrakenBatch(x, fileName, url, batch_id, interaction)

  return x;
};



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
  // check to make sure the member is an object
  if (typeof member !== "object") {
    try {
      throw new Error("The member is not an object");
    } catch (error) {
      scripts.logError(error);
    }
  } else {
    try {
      obj = {
        // get the user name of the user who triggered the interaction
        name: `${member.user.username}`,
        displayName: `${member.displayName}`,
        // get the user id of the user who triggered the interaction
        userId: `${member.user.id}`,
        // get the user avatar of the user who triggered the interaction
        avatar: `${member.user.avatarURL()}`,
        // get the user role of the user who triggered the interaction
        role: `${member.roles.highest.name}`,
        // get the date the user joined the server
        joined: `${member.joinedAt}`,
        // get the date the user joined discord
        created: `${member.user.createdAt}`,
        // get the number of times the user has been kicked
        kicks: `${member.user.kicks === undefined ? 0 : member.user.kicks}`,
        // get the number of times the user has been banned
        bans: `${member.user.bans === undefined ? 0 : member.user.bans}`,
        // get the number of times the user has been warned
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
 * Returns an object with information about the interaction
 *
 * @param {Object} interaction - The interaction object from which to get the information
 *
 * @returns {Object} An object with information about the interaction
 *
 * @throws {Error} If there is an error getting the information or if the interaction is not an object
 */
function getInteractionObj(interaction) {
  // check to make sure the interaction is an object
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
          // get the user name of the user who triggered the interaction
          name: `${interaction.member.user.username}`,
          displayName: `${interaction.member.displayName}`,
          // get the user id of the user who triggered the interaction
          userId: `${interaction.member.user.id}`,
          // get the user avatar of the user who triggered the interaction
          avatar: `${interaction.member.user.avatarURL()}`,
          // get the user role of the user who triggered the interaction
          role: `${interaction.member.roles.highest.name}`,
          // get the user role id of the user who triggered the interaction
          roleID: `${interaction.member.roles.highest.id}`,
          // get the array of roles the user who triggered the interaction has
          roles: interaction.member.roles,
        },
      };
      return obj;
    } catch (error) {
      scripts.logError(error, "Error creating interaction object");
    }
  }
}

function extractID(str) {
  if (str === undefined) return;
  console.log(`THE STRING:`, str);
  if (str.includes("#")) {
    let id = `#${str.split("#")[1]}`;
    return id;
  } else {
    try {
      throw new Error("The string does not contain a #");
    } catch (error) {
      scripts.logError(error, str);
    }
  }
}

// // Buttons

const linkButton = (label, url) => {
  let button = createBtn.createButton({
    link: url,
    label: label,
    style: "link",
  });
  return button;
};

let errEmbed = () => {
  return new EmbedBuilder()
    .setColor("#FF0000")
    .setTitle("❗️ Error")
    .setDescription("Invalid properties were given to create the embed");
};

let errMessage = () => {
  return { embeds: [errEmbed()] };
};

let getOnlineCount = async (interaction) => {
  let onlineCount = 0;

  const cache = await interaction.guild.members.fetch();
  let fetchedMembers = cache.filter(ctx.presence?.status === "online");
  onlineCount = fetchedMembers.size;
  return onlineCount;
};

let getOfflineCount = (interaction) => {
  let offlineCount = 0;
  interaction.guild.members
    .fetch({ withPresences: true })
    .then((fetchedMembers) => {
      const totalOffline = fetchedMembers.filter(
        (member) => member.presence?.status === "offline"
      );
      offlineCount = totalOffline.size;
      // Now you have a collection with all online member objects in the totalOnline variable
    });
  return offlineCount;
};

let getIdleCount = (interaction) => {
  let idleCount = 0;
  interaction.guild.members
    .fetch({ withPresences: true })
    .then((fetchedMembers) => {
      const totalIdle = fetchedMembers.filter(
        (member) => member.presence?.status === "idle"
      );
      idleCount = totalIdle.size;
      // Now you have a collection with all online member objects in the totalOnline variable
    });
  return idleCount;
};

let getDndCount = (interaction) => {
  let dndCount = 0;
  interaction.guild.members
    .fetch({ withPresences: true })
    .then((fetchedMembers) => {
      const totalDnd = fetchedMembers.filter(
        (member) => member.presence?.status === "dnd"
      );
      dndCount = totalDnd.size;
      // Now you have a collection with all online member objects in the totalOnline variable
    });
  return dndCount;
};

let getBotCount = (interaction) => {
  let botCount = 0;
  interaction.guild.members
    .fetch({ withPresences: true })
    .then((fetchedMembers) => {
      const totalBots = fetchedMembers.filter((member) => member.user.bot);
      botCount = totalBots.size;
      // Now you have a collection with all online member objects in the totalOnline variable
    });
  return botCount;
};

let getHumanCount = (interaction) => {
  let humanCount = 0;
  interaction.guild.members
    .fetch({ withPresences: true })
    .then((fetchedMembers) => {
      const totalHumans = fetchedMembers.filter((member) => !member.user.bot);
      humanCount = totalHumans.size;
      // Now you have a collection with all online member objects in the totalOnline variable
    });
  return humanCount;
};

let getOnlineHumans = (interaction) => {
  let onlineHumans = 0;
  interaction.guild.members
    .fetch({ withPresences: true })
    .then((fetchedMembers) => {
      const totalOnlineHumans = fetchedMembers.filter(
        (member) => member.presence?.status === "online" && !member.user.bot
      );
      onlineHumans = totalOnlineHumans.size;
      // Now you have a collection with all online member objects in the totalOnline variable
    });
  return onlineHumans;
};

let getOnlineBots = (interaction) => {
  let onlineBots = 0;
  interaction.guild.members
    .fetch({ withPresences: true })
    .then((fetchedMembers) => {
      const totalOnlineBots = fetchedMembers.filter(
        (member) => member.presence?.status === "online" && member.user.bot
      );
      onlineBots = totalOnlineBots.size;
      // Now you have a collection with all online member objects in the totalOnline variable
    });
  return onlineBots;
};

let getOfflineHumans = (interaction) => {
  let offlineHumans = 0;
  interaction.guild.members
    .fetch({ withPresences: true })
    .then((fetchedMembers) => {
      const totalOfflineHumans = fetchedMembers.filter(
        (member) => member.presence?.status === "offline" && !member.user.bot
      );
      offlineHumans = totalOfflineHumans.size;
      // Now you have a collection with all online member objects in the totalOnline variable
    });
  return offlineHumans;
};

let getOfflineBots = (interaction) => {
  let offlineBots = 0;
  interaction.guild.members
    .fetch({ withPresences: true })
    .then((fetchedMembers) => {
      const totalOfflineBots = fetchedMembers.filter(
        (member) => member.presence?.status === "offline" && member.user.bot
      );
      offlineBots = totalOfflineBots.size;
      // Now you have a collection with all online member objects in the totalOnline variable
    });
  return offlineBots;
};

let getMemberCount = (interaction) => {
  let memberCount = 0;
  interaction.guild.members
    .fetch({ withPresences: true })
    .then((fetchedMembers) => {
      const totalMembers = fetchedMembers.filter((member) => !member.user.bot);
      memberCount = totalMembers.size;
      // Now you have a collection with all online member objects in the totalOnline variable
    });
  return memberCount;
};

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

let getRandID = () =>
{ 
  let randID = "";
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  let millisecond = date.getMilliseconds();
  randID = `#${Math.floor(Math.random() * 999) + 999}${year}${month}${day}${hour}${minute}${second}${millisecond}`;
  return randID;
}

async function throwErrorReply(
  obj
) {

  // let obj = {
  //   interaction: interaction,
  //   error: error,
  //   action: action,
  //   interaction2: interaction2,
  // }
  let { interaction, error, action, interaction2, } = obj;
  if(!interaction || !error) return;
  console.log('New Error Sent In Server\n\n', error)
  try {
    await interaction.editReply({
      embeds: [
        createEmb.createEmbed({
          title: "❗️ There was an Error , Share the Error w the Developer",
          description:
            `__**While :**__ **\`${action !== null ? action : "? : no action inputted"}\`**\n` +  `${
              interaction.commandName
                ? `Command: \`${interaction.commandName}\`\n`
                : ""
            }` +
            "```js\n" +
            error +
            "\n```\n" +
            `Error Report Summary:` +
            "\n```js\n" +
            `username: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel Name: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nMessage Content: ${interaction.message.content}\nCustom ID: ${interaction.customId}\nTimestamp: ${new Date()}` +
            "\n```",
          color: scripts.getErrorColor(),
          footer: {
            text: "Contact STEVE JOBS and Send the Error",
            iconURL: interaction.user ? interaction.user.avatarURL() :  interaction.client.user.avatarURL(),
          },
        }),
      ],
    });
  } catch (err) {
    if (interaction2) {
      try {
        await interaction2.editReply({
          embeds: [
            createEmb.createEmbed({
              title: "❗️ There was an Error , Share the Error w the Developer",
              description:
                `ORIGINAL ERROR\n\n__**While :**__ **\`${action !== null ? action : "? : no action inputted"}\`**\n` +  `${
                  interaction.commandName
                    ? `Command: \`${interaction.commandName}\`\n`
                    : ""
                }` +
                "```js\n" +
                error +
                "\n```\n" +
                `Error Report Summary:` +
                "\n```js\n" +
                `username: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel Name: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nMessage Content: ${interaction.message.content}\nCustom ID: ${interaction.customId}\nTimestamp: ${new Date()}` +
                "\n```" + `\n\nAdditional ERROR\n\n__**While :**__ **\`sending the original error message\`**\n` +
                "```js\n" +
                err +
                "\n```\n" +
                `Error Report Summary:` +
                "\n```js\n" +
                `username: ${interaction2.member.user.username}\nID: ${interaction2.member.user.id}\nGuild: ${interaction2.guild.name}\nGuild ID: ${interaction2.guild.id}\nChannel Name: ${interaction2.channel.name}\nChannel ID: ${interaction2.channel.id}\nMessage ID: ${interaction2.message.id}\nMessage Content: ${interaction2.message.content}\nCustom ID: ${interaction2.customId}\nTimestamp: ${new Date()}` +
                "\n```",
              color: scripts.getErrorColor(),
              footer: {
                text: "Contact STEVE JOBS and Send the Error",
                iconURL: interaction.user ? interaction.user.avatarURL() : interaction2.user ? interaction2.user.avatarURL() : interaction.client.user.avatarURL(),
              },
            }),
          ],
        });
      } catch (errr) {
        console.log(
          `error occurred when trying to send the user this-> Error: ${error}\n\n\nThe error that occurred when trying to send the user the 2nd time -> error is: ${err}\n\n\nThe error that occurred when trying to send the user the 3rd time -> error is: ${errr}`
        );
      }
    } else {
      try {
        await interaction.channel.send({
          embeds: [
            createEmb.createEmbed({
              title: "❗️ There was an Error , Share the Error w the Developer",
              description:
                `ORIGINAL ERROR\n\n__**While :**__ **\`${action !== null ? action : "? : no action inputted"}\`**\n` +  `${
                  interaction.commandName
                    ? `Command: \`${interaction.commandName}\`\n`
                    : ""
                }` +
                "```js\n" +
                error +
                "\n```\n" +
                `Error Report Summary:` +
                "\n```js\n" +
                `username: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel Name: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nMessage Content: ${interaction.message.content}\nCustom ID: ${interaction.customId}\nTimestamp: ${new Date()}` +
                "\n```" + `\n\nAdditional ERROR\n\n__**While :**__ **\`sending the original error message\`**\n` +
                "```js\n" +
                err +
                "\n```\n" +
                `Error Report Summary:` +
                "\n```js\n" +
                `username: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel Name: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nMessage Content: ${interaction.message.content}\nCustom ID: ${interaction.customId}\nTimestamp: ${new Date()}` +
                "\n```",
              color: scripts.getErrorColor(),
              footer: {
                text: "Contact STEVE JOBS and Send the Error",
                iconURL: interaction.user ? interaction.user.avatarURL() :  interaction.client.user.avatarURL(),
              },
            }),
          ],
        });
      } catch (errr) {
        console.log(`error occurred when trying to send the user this-> Error: ${error}\n\n\nThe error that occurred when trying to send the user the 2nd time -> error is: ${err}\n\n\nThe error that occurred when trying to send the user the 3rd time -> error is: ${errr}`)
      }
    }
  }
}

