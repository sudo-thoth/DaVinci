const client = require("../../index.js");
const setupChannel = require("./setupChannel.js");

/**
 * Sets up all channels the bot is in.
 *
 * @param {Object} client - The Discord client object.
 */
async function setupChannels(client){
  // get all the channels the bot is in
  const channels = client.channels.cache.map((channel) => channel);

  for (const channel of channels) {
    // create the guild-specific object in the localDB
    client.localDB[channel.guild.name].channels = {};
    // create the channel-specific object in the localDB
    client.localDB[channel.guild.name].channels[channel.name] = {};
    // set up the channel object in the database
    await setupChannel(channel);
  }
  console.log(`Channel data setup complete for all Channels from the client`);
};

client.setupChannels = setupChannels;

module.exports = setupChannels;
