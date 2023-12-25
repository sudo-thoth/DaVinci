const mongoose = require("mongoose");

/**
 * Logs in to MongoDB using the provided token and sets the client's connectedToMongoose property accordingly.
 *
 * @param {Object} client - The Discord.js client object.
 * @param {string} token - The MongoDB connection string.
 *
 * @returns {Promise<void>} - A Promise that resolves when the login is successful.
 */
async function login_mongodb( token, client ) {
  // Get the MongoDB connection from the mongoose library.
  const db = mongoose.connection;

  // Define an error event handler for the database connection.
  db.on("error", () => {
    // When there is an error, set the client's connectedToMongoose property to false.
    client.connectedToMongoose = false;
    console.error.bind(console, "connection error:");
  });

  // Define an event handler for when the database connection is open.
  db.once("open", () => {
    // When the connection is open, log a message and set the client's connectedToMongoose property to true.
    console.log("Connected to MongoDB");
    client.connectedToMongoose = true;
  });

  // Check if the mongoose library is defined (not undefined).
  if (mongoose === undefined) {
    return;
  } else {
    try {
      // Attempt to connect to MongoDB using the provided connection token.
      await mongoose.connect(token);
      // If the connection is successful, log a success message and set the client's connectedToMongoose property to true.
      console.log(`---------- >> MongoDB is Online << ----------`);
      client.connectedToMongoose = true;
    } catch (error) {
      // If there's an error during the connection attempt, set the client's connectedToMongoose property to false and log the error.
      client.connectedToMongoose = false;
      console.log(error);
    }
  }
}

module.exports = {
  login_mongodb,
};
