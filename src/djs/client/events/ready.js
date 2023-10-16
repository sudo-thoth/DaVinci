const setupOnReady = require("../../functions/ready/setupOnReady.js");

module.exports = {
  name: "ready",
  once: true,

  /**
   * Executes the ready command.
   *
   * @param {Object} client - The Discord client object.
   */
  async execute(client) {
    try {
      // run the setupOnReady function to set up the bot
      console.log("Running Setup 🦾");
      await setupOnReady(client);
    } catch (error) {
      console.log(error);
    }
    // log that the bot is ready
    console.log(`Ready! ✅`);
  },
};
