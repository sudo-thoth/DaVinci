const client = require("../../index.js");
const setupChannel = require("./setupChannel.js");

/**
 * Retrieves the data for a given channel from the channels database.
 * If the channel is not found in the database, sets up the channel and returns null.
 *
 * @param {Object} channel - The channel object to retrieve data for.
 * @returns {Object|null} - The data object for the channel, or null if the channel was not found in the database.
 */
const getChannel = async (channel) => {
  let data;
  // searching channels db for the channel
  try {
    data = await client.channelsDB.findOne({
      channelID: `${channel.id}`,
      serverID: `${channel.guild.id}`,
    });
  } catch (error) {
    console.log(
      `an error occurred while trying to get the data from the database: `,
      error
    );
  }
  if (data == null) {
    // if the channel is not found in the db, setup the channel
    data = await setupChannel(channel);
  } 
  return data;
};

client.getChannel = getChannel;

module.exports = getChannel;