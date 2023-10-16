const client = require("../../index.js");

/**
 * Sets up a channel in the database.
 *
 * @param {Object|string} channel - The channel object or channel ID to set up.
 * @returns {Object} - The data object for the channel.
 */
const setupChannel = async (channel) => {
  let data;
  // check if channel is not obj then fetch channel as if channel var is channel id
  if (!(typeof channel === "object") || typeof channel === "string") {
    channel = client.channels.cache.get(channel);
  }

  try {
    // get the data object for the channel from the database
    data = await client.getChannel(channel);
  } catch (error) {
    console.log(
      `An error occurred while trying to get the data from the database: ${error}`
    );
  }

  if (data == null) {
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
      await client.channelsDB.create(obj);
      console.log(`Created and saved to database`);
    } catch (error) {
      console.log(error);
    }

    try {
      // get the data object for the channel from the database
      data = await client.getChannel(channel);
    } catch (error) {
      console.log(
        `An error occurred while trying to get the data from the database: ${error}`
      );
    }
    return data;
  } else {
    // if the channel is found in the db, update the channel object
    const obj = {
      _id: `${data._id}`,
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
      attachments_filterOn: data.attachments_filterOn,
      links_filterOn: data.links_filterOn,
      deletedMessages: data.deletedMessages,
    };
    try {
      // update the channel object in the database
      data = await client.channelsDB.findOneAndUpdate(
        { channelID: channel.id },
        obj
      );
      // console.log(`${channel.name}-${channel.id} updated in db`);
    } catch (error) {
      console.log(error);
    }
    return data;
  }
};
client.setupChannel = setupChannel;

module.exports = setupChannel;
