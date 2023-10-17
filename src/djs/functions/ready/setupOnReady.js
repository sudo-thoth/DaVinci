const setupServers = require("./setupServers");
const setupUsers = require("./setupUsers");
const setupChannels = require("./setupChannels");
const setupLocalDBs = require("./setupLocalDBs");
const runFunctionEveryXMinutes = require("../scripts/runFunctionEveryXMinutes");
const checkPermaBans = require("../checks/checkPermaBans.js");
const checkAutoroles = require("../checks/checkAutoRoles.js");
const getServer = require("./getServer.js");
const getUser = require("./getUser.js");
const getChannel = require("./getChannel.js");
const guildObjectArrayProperties = require("./guildObjectArrayProperties.js");

/**
 * Sets up all local DBs, servers, users, and channels.
 *
 * @param {Object} client - The Discord client object.
 */
async function setup(client) {
  try {
    client.getServer = getServer;
    client.getUser = getUser;
    client.getChannel = getChannel;
    client.guildObjectArrayProperties = guildObjectArrayProperties;


    // setup all local DBs
    setupLocalDBs(client);

    // setup all servers in the database
    await setupServers(client);
    // setup all users in the database
    await setupUsers(client);
    // setup all channels in the database
    await setupChannels(client);
  } catch (error) {
    console.log(error, "error in setupServers, setupUsers, setupChannels");
  }
}

/**
 * Sets up the bot on ready.
 *
 * @param {Object} client - The Discord client object.
 */
async function setupOnReady(client) {
  try {
    // setup all local DBs, servers, users, and channels
    await setup(client);
  } catch (error) {
    console.log(error, "Error in setup");
  }

  try {
    // check for permanent bans and kick and ban the user if found
    await checkPermaBans(client);
  } catch (error) {
    console.log(error, "Error in checkPermaBans");
  }

  try {
    // check for autoroles and add the role to any member that does not have it
    await checkAutoroles(client);
  } catch (error) {
    console.log(error, "Error in checkAutoroles");
  }

  try {
    // run checkPermaBans every 10 minutes
    runFunctionEveryXMinutes(10, checkPermaBans);
    // run checkAutoroles every 10 minutes
    runFunctionEveryXMinutes(10, checkAutoroles);
  } catch (error) {
    console.log(error, "Error in runFunctionEveryXMinutes");
  }
}

module.exports = setupOnReady;
