const client = require("../../index.js");
const mongoose = require("mongoose");

/**
 * Retrieves the data for a given channel from the channels database.
 * If the channel is not found in the database, sets up the channel and returns null.
 *
 * @param {Object} channel - The channel object to retrieve data for.
 * @returns {Object|null} - The data object for the channel, or null if the channel was not found in the database.
 */
async function getChannel (channel){
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

/**
 * Sets up a channel in the database.
 *
 * @param {Object|string} channel - The channel object or channel ID to set up.
 * @returns {Object} - The data object for the channel.
 */
async function setupChannel(channel){
  let data;
  // check if channel is not obj then fetch channel as if channel var is channel id
  if (!(typeof channel === "object") || typeof channel === "string") {
    channel = client.channels.cache.get(channel);
  }
    // if the channel is not found in the db, set up the channel
    const obj = {
      _id: `${new mongoose.Types.ObjectId()}`,
      channelID: `${channel?.id}`,
      channelName: `${channel?.name}`,
      createdAt: `${channel?.createdAt}`,
      serverName: `${channel?.guild?.name}`,
      serverID: `${channel?.guild?.id}`,
      manageable: channel?.manageable,
      viewable: channel?.viewable,
      parentCategoryName: `${channel?.parent?.name}`,
      parentCategoryID: `${channel?.parentId}`,
      url: `${channel?.url}`,
      copyright_filterOn: false,
      attachments_filterOn: false,
      links_filterOn: false,
      deletedMessages: [],
    };
    try {
      // create the channel object in the database
      data = await client.channelsDB.create(obj);
      console.log(`Created and saved to database`);
    } catch (error) {
      console.log(error);
      try {
        // get the data object for the channel from the database
        data = await getChannel(channel);
      } catch (error) {
        console.log(
          `An error occurred while trying to get the data from the database: ${error}`
        );
      }
    }
    return data;
};

client.getChannel = getChannel;

module.exports = getChannel;