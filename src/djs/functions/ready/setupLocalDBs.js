const client = require("../../index.js");
const { Collection } = require("discord.js");

/**
 * Sets up local databases for the bot.
 * @async
 * @function setupLocalDBs
 * @returns {Promise<void>}
 */
async function setupLocalDBs() {
  // create a local map of guilds with id as key and guild object as value
  client.localGuilds = new Collection();

  // create a local log array to store log messages
  client.localLog = [];

  // create a local database object to store data for each guild and channel
  client.localDB = {};
}

module.exports = setupLocalDBs;
