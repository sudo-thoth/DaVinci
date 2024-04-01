const client = require("../../index.js");
const setupUser = require("./setupUser.js");

/**
 * Retrieves the data for a given user from the users database.
 * If the user is not found in the database, sets up the user and returns the data object for the user.
 *
 * @param {Object|string} user - The user object or user ID to retrieve data for.
 * @returns {Object} - The data object for the user
 * @throws {Error} - If an error occurs while trying to get the data from the database.
 */
async function getUser(user) {
  let data;
  // searching users db for the user
  // check if user is not obj then fetch user as if user var is user id
  if (!(typeof user === "object") || typeof user === "string") {
    user = client.users.cache.get(user);
  }

  try {
    data = await client.usersDB.findOne({ userID: `${user.id}` });
  } catch (error) {
    console.log(
      `an error occurred while trying to get the data from the database: `,
      error
    );
  }
  if (data == null) {
    // if the user is not found in the db, setup the user
    data = await setupUser(user);
  }
  return data;
};

client.getUser = getUser;

module.exports = getUser;
