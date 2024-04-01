// Import necessary modules
require("dotenv").config({ path: "./my.env" });
const fs = require("fs");
const { Client, GatewayIntentBits, Collection } = require(`discord.js`);

// Create a new Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.AutoModerationExecution,
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildBans // Ensure this intent is included
  ],
  partials: ['User', 'GuildMember', 'Channel', 'Message', 'Reaction', 'Presence']
});

// Import and set up handlers
const handleFunctions = require("./client/handlers/handleFunctions");
const handleEvents = require("./client/handlers/handleEvents");
const handleCommands = require("./client/handlers/handleCommands");

// Import folder paths for Discord.js functions, commands, and events
const djsFunctionFolders_MAC_PATH = process.env.DJS_FUNCTION_FOLDERS_MAC_PATH ||"./src/djs/functions";
const djsCommandFolders_MAC_PATH = process.env.DJS_COMMAND_FOLDERS_MAC_PATH || "./src/djs/commands/";
const djsEventFiles_MAC_PATH = process.env.DJS_EVENT_FILES_MAC_PATH || "./src/djs/client/events/";

const djsFunctionFolders_WIN_PATH = process.env.DJS_FUNCTION_FOLDERS_WIN_PATH || ".\\src\\djs\\functions";
const djsCommandFolders_WIN_PATH = process.env.DJS_COMMAND_FOLDERS_WIN_PATH || ".\\src\\djs\\commands";
const djsEventFiles_WIN_PATH = process.env.DJS_EVENT_FILES_WIN_PATH || ".\\src\\djs\\events";

// Create a collection for databases
let dbs = new Collection();

// Define folder paths for Discord.js functions, commands, events, and MongoDB configuration

let djsFunctionFoldersTemp;
let djsCommandFoldersTemp;
let djsEventFilesTemp;

// check to see if its being run on a windows or mac machine
// if its a mac machine
if (process.platform === "darwin") {
  
  djsFunctionFoldersTemp = fs.readdirSync(djsFunctionFolders_MAC_PATH);
  djsCommandFoldersTemp = fs.readdirSync(djsCommandFolders_MAC_PATH);
  djsEventFilesTemp = fs
    .readdirSync(djsEventFiles_MAC_PATH)
    .filter((file) => file.endsWith(".js"));

// if its a windows machine
} else if (process.platform === "win32") {

  djsFunctionFoldersTemp = fs.readdirSync(djsFunctionFolders_WIN_PATH);
  djsCommandFoldersTemp = fs.readdirSync(djsCommandFolders_WIN_PATH);
  djsEventFilesTemp = fs
    .readdirSync(djsEventFiles_WIN_PATH)
    .filter((file) => file.endsWith(".js"));
}

const djsFunctionFolders = djsFunctionFoldersTemp;
const djsCommandFolders = djsCommandFoldersTemp;
const djsEventFiles = djsEventFilesTemp;

// Import necessary scripts and configurations
const mongoConfig = fs.readdirSync("./src/MongoDB/db/config/");
const { login_mongodb } = require("./functions/ready/login_mongodb.js");
const { login_mega } = require("./functions/ready/login_mega.js");

// Get environment variables
const { token, MongoDB_Token_DaVinci, MEGA_EMAIL, MEGA_PASSWORD } = process.env;

// Define the client's email and password for Mega
const mega_email = `${MEGA_EMAIL}`;
const mega_password = `${MEGA_PASSWORD}`;

// Set up initial properties for the client
client.connectedToMega;
client.commands = new Collection();


// Export the client for use in other modules
module.exports = client;

// Handle events, functions, and commands
handleEvents(client, djsEventFiles, 1);
handleEvents(client, mongoConfig, 2);
handleFunctions(djsFunctionFolders, "./src/djs/functions");

(async () => {
  try {
    // Connect to MongoDB
    await login_mongodb( MongoDB_Token_DaVinci, client );

    // Handle commands and login to Mega
    handleCommands(client, djsCommandFolders, "./src/djs/commands").then(
      login_mega(client, mega_email, mega_password).then(async (mega) => {
        // Login to the Discord client
        client.login(token);
      }).catch((error) => {
        console.log(error, "\n\nerror during login_mega in index.js");
        // Login to the bot client in case of an error
        client.login(token);
      })
    );
  } catch (error) {
    console.log(error, "error during login activities in index.js");
  }
})();
