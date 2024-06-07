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
      // reset client commands
      try{
        client.application.commands.set([]);
      } catch(error){
        console.error(`Error while trying to reset client commands: ${error}`);
      }
      
      await setupOnReady(client);
    } catch (error) {
      console.log(error);
    }
    // log that the bot is ready
    console.log(`Ready! ✅`);
  },
};
