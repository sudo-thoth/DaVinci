const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const dotenv = require("dotenv");
dotenv.config({ path: "../../../../my.env" });
const { token } = process.env;

/**
 * Disables all slash commands for a given guild.
 * @param {Discord.Client} client - The Discord client object.
 * @param {Discord.Guild} guild - The guild object for which to disable slash commands.
 * @returns {Promise<void>} - A Promise that resolves when the slash commands have been disabled.
 */
async function slashCommandDisabler(client, guild) {
  // create a rest object
  const rest = new REST({
    version: "9",
  }).setToken(token);
  // disable slash commands in the server
  await rest.put(Routes.applicationGuildCommands(client.id, guild.id), {
    body: [],
  });
  console.log("Successfully disabled application (/) commands.");
}

module.exports = slashCommandDisabler;
