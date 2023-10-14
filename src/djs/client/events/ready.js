const { Collection } = require("discord.js");
const onReady = require("../../functions/ready/onReady.js");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    client.channelsDB = require(`../../../MongoDB/db/schemas/schema_channels.js`);
    client.usersDB = require(`../../../MongoDB/db/schemas/schema_users.js`);
    client.guildsDB = require(`../../../MongoDB/db/schemas/schema_guilds.js`);

    // make a local map of guilds with id as key and guild object as value
    client.localGuilds = new Collection();
    client.localLog = [];
    client.localDB = {};
   
    try{
      onReady(client);
    } catch (error) {
      console.log(error);
    }


    console.log(`Ready! ✅`);
  },
};
