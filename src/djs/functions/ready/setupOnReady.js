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
    console.log("Setting up servers, users, and channels 🦾")
    await setupServers(client);
    console.log("Servers Setup 🦾")
    // setup all users in the database
    await setupUsers(client);
    console.log("Users Setup 🦾")
    // setup all channels in the database
    await setupChannels(client);
    console.log("Channels Setup 🦾")
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
    console.log("Setup complete ✅")
  } catch (error) {
    console.log(error, "Error in setup");
  }

  try {
    // check for permanent bans and kick and ban the user if found
    await checkPermaBans(client);
    console.log("Checked for permanent bans ✅")
  } catch (error) {
    console.log(error, "Error in checkPermaBans");
  }

  try {
    // check for autoroles and add the role to any member that does not have it
    await checkAutoroles(client);
    console.log("Checked for autoroles ✅")
  } catch (error) {
    console.log(error, "Error in checkAutoroles");
  }

  try {
    // run checkPermaBans every 10 minutes
    runFunctionEveryXMinutes(10, checkPermaBans, {client: client});
    // run checkAutoroles every 10 minutes
    runFunctionEveryXMinutes(10, checkAutoroles, {client: client});
  } catch (error) {
    console.log(error, "Error in runFunctionEveryXMinutes");
  }
  console.log("✅ All Setup Checks Complete 🦾 ✅")
}

module.exports = setupOnReady;
