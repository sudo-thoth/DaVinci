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
      // for every guild check if the commandStyle is either slash or both or if there is no guildObject found for the guild, then register the commands
      const guilds = await client.guilds.fetch();
      for (const guild of guilds) {
        const guildObject = await client.getServer(guild[1]);
        if (
          guildObject.commandStyle === "slash" ||
          guildObject.commandStyle === "both" ||
          !guildObject.commandStyle
        ) {
          await rest.put(
            Routes.applicationGuildCommands(clientId, guild[1].id),
            {
              body: client.commandArray,
            }
          );
        }
      }
      console.log("Successfully reloaded application (/) commands.");
      console.log(`Load Commands: ✅`);
    } catch (error) {
      console.error(`Load Commands: ❌`);
       console.error(error);
    }
  })();
  console.log(`Handle Commands: ✅`);
};
