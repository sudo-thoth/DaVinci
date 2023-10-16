const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const dotenv = require("dotenv");
dotenv.config({ path: "../../../../my.env" });
const { token } = process.env;

/**
 * Enables slash commands for a given Discord client and guild.
 * @param {Discord.Client} client - The Discord client object.
 * @param {Discord.Guild} guild - The Discord guild object.
 * @returns {Promise<void>} - A Promise that resolves when the slash commands are enabled.
 */
async function slashCommandEnabler(client, guild) {
  // create a rest object
  const rest = new REST({
    version: "9",
  }).setToken(token);
  // enable slash commands in the server
  await rest.put(Routes.applicationGuildCommands(client.id, guild.id), {
    body: client.commandArray,
  });
  console.log("Successfully enabled application (/) commands.");
}

module.exports = slashCommandEnabler;
