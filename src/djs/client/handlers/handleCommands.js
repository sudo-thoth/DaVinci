const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
const dotenv = require("dotenv")
dotenv.config({ path: "../../../../my.env" });
const { token, clientId} = process.env;

module.exports = async (client, commandFolders, path) => {
  client.commandArray = [];
  const filteredCommandFolders = commandFolders.filter(folder => !folder.includes('.DS_Store'));
  for (folder of filteredCommandFolders) {
    const commandFiles = fs
  .readdirSync(`${path}/${folder}`)
  .filter((file) => file.endsWith(".js") && !file.includes('.DS_Store'));
    for (const file of commandFiles) {
      const command = require(`../../commands/${folder}/${file}`);
      client.commands.set(command.data.name, command);
      client.commandArray.push(command.data.toJSON());
    }
  }

  const rest = new REST({
    version: "9",
  }).setToken(token);

  (async () => {
    try {
      console.log("Started refreshing application (/) commands.");
      //console.log(`Logged in as ${client.user.tag}!`);
      await rest.put(Routes.applicationCommands(clientId), {
        body: client.commandArray,
      });
      console.log("Successfully reloaded application (/) commands.");
      console.log(`Load Commands: ✅`);
    } catch (error) {
      console.error(`Load Commands: ❌`);
       console.error(error);
    }
  })();
  console.log(`Handle Commands: ✅`);
};
