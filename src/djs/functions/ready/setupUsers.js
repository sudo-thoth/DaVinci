const client = require("../../index.js");
const setupUser = require("./setupUser.js");

/**
 * Sets up all users the bot is in.
 *
 * @param {Object} client - The Discord client object.
 */
async function setupUsers(client) {
  // get all the users the bot is in
  const users = client.users.cache.map((user) => user);

  for (const user of users) {
    // set up the user object in the database
    await setupUser(user);
  }
  console.log(`User data setup complete for all Users from the client`);
};

client.setupUsers = setupUsers;

module.exports = setupUsers;
