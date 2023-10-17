const client = require("../../index.js");
const setupServer = require("./setupServer.js");
// require the channel, user, and guild schemas
client.channelsDB = require(`../../../MongoDB/db/schemas/essentialData/schema_channels.js`);
client.usersDB = require(`../../../MongoDB/db/schemas/essentialData/schema_users.js`);
client.guildsDB = require(`../../../MongoDB/db/schemas/essentialData/schema_guilds.js`);

  /**
   * Retrieves the data for a given server from the servers database.
   * If the server is not found in the database, sets up the server and returns null.
   *
   * @param {Object|string} guild - The guild object or guild ID to retrieve data for.
   * @returns {Object|null} - The data object for the server, or null if the server was not found in the database.
   */
  async function getServer(guild){
    let data;
    // searching servers db for the server
    // check if guild is not obj then fetch guild as if guild var is guild id
    if (!(typeof guild === "object") || typeof guild === "string") {
      guild = client.guilds.cache.get(guild);
    }

    try {
      data = await client.guildsDB.findOne({ serverID: `${guild.id}` });
    } catch (error) {
      console.log(
        `an error occurred while trying to get the data from the database: `,
        error
      );
    }
    if (data == null) {
      // if the server is not found in the db, setup the server
      data = await setupServer(guild);
    }

    return data;
  };

  client.getServer = getServer;

  module.exports = getServer;