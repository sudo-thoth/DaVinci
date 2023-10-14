require("dotenv").config({ path: "./my.env" });
const fs = require("fs");
const {
  Client,
  GatewayIntentBits,
  Collection,
} = require(`discord.js`);
const mongoose = require('mongoose');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds , GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.AutoModerationExecution,
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildModeration,
    4 // GuildModeration I think its actually GuildBans
   ],
  partials: ['User', 'GuildMember', 'Channel', 'Message', 'Reaction', 'Presence'] 
});

const handleFunctions = require("./client/handlers/handleFunctions");
const handleEvents = require("./client/handlers/handleEvents");
const handleCommands = require("./client/handlers/handleCommands");
let dbs = new Collection();
const djsFunctionFolders = fs.readdirSync("./src/djs/functions");
const djsCommandFolders = fs.readdirSync("./src/djs/commands");
const djsEventFiles = fs
  .readdirSync("./src/djs/client/events")
  .filter((file) => file.endsWith(".js"));
  //const scripts = require("./functions/scripts/scripts.js")
  const mongoConfig = fs.readdirSync("./src/MongoDB/db/config");

  const {login_mongodb} = require("./functions/ready/login_mongodb.js");
  const {login_mega} = require("./functions/ready/login_mega.js");

const { token, MongoDB_Token_DaVinci } = process.env;

const mega_email = `${process.env.MEGA_EMAIL}`; 
const mega_password = `${process.env.MEGA_PASSWORD}`; 



client.connectedToMega;

client.commands = new Collection();

client.on("ready", () => {
  console.log("---------- >> Bot is Online << ----------");

  const activities = [
    "with art and knowledge",
    "Leonardo's masterpieces",
    "DaVinci's wisdom",
    "Inventions and innovation",
    "Code like DaVinci",
    "Unlocking secrets",
    "Painting the Mona Lisa",
    "Studying the Vitruvian Man",
    "Exploring ancient Egypt",
    "Deciphering the Great Pyramids",
];


  const types = ["PLAYING", "LISTENING", "WATCHING", "STREAMING", "COMPETING"];

  const statuses = ["online", "idle", "dnd", "invisible"];

  setInterval(() => {
    const text = activities[Math.floor(Math.random() * activities.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    // const status = statuses[Math.floor(Math.random() * statuses.length)];
    const status = statuses[1];
    // client.user.setPresence({activities : [{name: text, type: type}], status: status});
    client.user.setPresence({ activities: [{ name: text }], status: status });
    client.user.setAct;
  }, 60000);
});
module.exports = client;





handleEvents(client, djsEventFiles, 1);
handleEvents(client, mongoConfig, 2);
handleFunctions(djsFunctionFolders, "./src/djs/functions");


(async () => {

    try{
    await login_mongodb(client, MongoDB_Token_DaVinci)

      handleCommands(client, djsCommandFolders, "./src/djs/commands").then( 
      login_mega(client, mega_email, mega_password).then(async (mega)=>
      {
        client.login(token)
        
      })
      .catch((error)=>{
        console.log(error, "\n\nerror during login_mega in index.js")
        // login to the bot client
        client.login(token)
      })
      ) // when changing bot tokens, make sure to change client id in handleCommands.js as well otherwise commands will not register to the correct client

      
      
      
    } catch(error){
      console.log(error, "error during login activities in index.js")
    }
    
  
})()


