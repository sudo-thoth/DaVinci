const client = require("../../index.js");
const { Collection } = require("discord.js");



async function setupLocalDBs() {
// require the channel, user, and guild schemas
client.channelsDB = require(`../../../MongoDB/db/schemas/essentialData/schema_channels.js`);
client.usersDB = require(`../../../MongoDB/db/schemas/essentialData/schema_users.js`);
client.guildsDB = require(`../../../MongoDB/db/schemas/essentialData/schema_guilds.js`);

// create a local map of guilds with id as key and guild object as value
client.localGuilds = new Collection();

// create a local log array to store log messages
client.localLog = [];

// create a local database object to store data for each guild and channel
client.localDB = {};
}


module.exports = setupLocalDBs;