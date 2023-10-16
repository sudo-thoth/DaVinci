// Import necessary modules
require("dotenv").config({ path: "./my.env" });
const fs = require("fs");
const { Client, GatewayIntentBits, Collection } = require(`discord.js`);
const mongoose = require('mongoose');

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

// Create a collection for databases
let dbs = new Collection();

// Define folder paths for Discord.js functions, commands, events, and MongoDB configuration
const djsFunctionFolders = fs.readdirSync("./src/djs/functions");
const djsCommandFolders = fs.readdirSync("./src/djs/commands");
const djsEventFiles = fs
  .readdirSync("./src/djs/client/events")
  .filter((file) => file.endsWith(".js"));

// Import necessary scripts and configurations
const mongoConfig = fs.readdirSync("./src/MongoDB/db/config");
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
    await login_mongodb(client, MongoDB_Token_DaVinci);

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
