const client = require(`../../index.js`);
const prefixHandler = require(`../../functions/prefixCommandHandling/prefixHandler.js`);

if (client) {


  // Handle the "ready" event
client.on("ready", () => {
  console.log("---------- >> Bot is Online << ----------");

  // Define activity options
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

  // Set random activities and presence status
  setInterval(() => {
    const text = activities[Math.floor(Math.random() * activities.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[1];
    client.user.setPresence({ activities: [{ name: text }], status: status });
    client.user.setAct;
  }, 60000);
});

// Event listener for interaction creation
client.on("interactionCreate", async (interaction) => {
  
});

// Event listener for when a new member joins a guild
client.on("guildMemberAdd", async (member) => {
  
});

// Event listener for guild audit log entry creation
client.on("guildAuditLogEntryCreate", async (entry) => {
  
});

// Event listener for bulk message deletion
client.on("messageDeleteBulk", async (messages) => {
  
});

// Event listener for when a new message is created
client.on("messageCreate", async (message) => {
  if(!message.user.bot){
    // TODO: Look into using the local DB so the bot does not have to make a request to the DB for every message

  // pass the message through the prefix command handler
  try {
    await prefixHandler(message, message.content);
  } catch (error) {
    console.log(error, `Failed Prefix Handler Attempt`);
  }
}
  
});

// Event listener for message deletion
client.on("messageDelete", async (message) => {
  
});

// Event listener for when a reaction is added to a message
client.on("messageReactionAdd", async (reaction, user) => {
  
});

// Event listener for when a reaction is removed from a message
client.on("messageReactionRemove", async (reaction, user) => {
  
});

// Event listener for when all reactions are removed from a message
client.on("messageReactionRemoveAll", async (message) => {
  
});

// Event listener for when all reactions of a specific emoji are removed from a message
client.on("messageReactionRemoveEmoji", async (message, emoji) => {
  
});

// Event listener for message update
client.on("messageUpdate", async (oldMessage, newMessage) => {
  
});

// Event listener for when application command permissions are updated
client.on("applicationCommandPermissionsUpdate", async (permissions) => {
  
});

// Event listener for auto-moderation action execution
client.on("autoModerationActionExecution", async (action) => {
  
});

// Event listener for auto-moderation rule creation
client.on("autoModerationRuleCreate", async (rule) => {
  
});

// Event listener for auto-moderation rule deletion
client.on("autoModerationRuleDelete", async (rule) => {
  
});

// Event listener for auto-moderation rule update
client.on("autoModerationRuleUpdate", async (rule) => {
  
});

// Event listener for cache sweep
client.on("cacheSweep", async () => {
  
});

// Event listener for when a new channel is created
client.on("channelCreate", async (channel) => {
  
});

// Event listener for when a channel is deleted
client.on("channelDelete", async (channel) => {
  
});

// Event listener for channel pins update
client.on("channelPinsUpdate", async (channel, time) => {
  
});

// Event listener for channel update
client.on("channelUpdate", async (oldChannel, newChannel) => {
  
});


// Event listener for debug
client.on("debug", async (info) => {
  
});

// Event listener for client error
client.on("error", async (error) => {
  
});


// Event listener for when a guild becomes available
client.on("guildAvailable", async (guild) => {
  
});

// Event listener for when a user is banned from a server
client.on("guildBanAdd", async (guild, user) => {
  
});

// Event listener for when a user is unbanned from a server
client.on("guildBanRemove", async (guild, user) => {
  
});

// Event listener for when a new guild is created
client.on("guildCreate", async (guild) => {
  
});

// Event listener for when a guild is deleted or unavailable
client.on("guildDelete", async (guild) => {
  
});

// Event listener for when a new emoji is created in a guild
client.on("emojiCreate", async (emoji) => {
  
});

// Event listener for when an emoji is deleted from a guild
client.on("emojiDelete", async (emoji) => {
  
});

// Event listener for when an emoji is updated in a guild
client.on("emojiUpdate", async (oldEmoji, newEmoji) => {
  
});

// Event listener for guild integrations update
client.on("guildIntegrationsUpdate", async (guild) => {
  
});


// Event listener for when a member becomes available in a guild
client.on("guildMemberAvailable", async (member) => {
  
});

// Event listener for when a member leaves or is removed from a guild
client.on("guildMemberRemove", async (member) => {
  
});

// Event listener for guild members chunk
client.on("guildMembersChunk", async (members, guild) => {
  
});

// Event listener for when a member's information is updated in a guild
client.on("guildMemberUpdate", async (oldMember, newMember) => {
  
});

// Event listener for when a new role is created in a guild
client.on("roleCreate", async (role) => {
  
});

// Event listener for when a role is deleted from a guild
client.on("roleDelete", async (role) => {
  
});

// Event listener for when a role is updated in a guild
client.on("roleUpdate", async (oldRole, newRole) => {
  
});

// Event listener for when a scheduled event is created in a guild
client.on("guildScheduledEventCreate", async (event) => {
  
});

// Event listener for when a scheduled event is deleted from a guild
client.on("guildScheduledEventDelete", async (event) => {
  
});

// Event listener for when a scheduled event is updated in a guild
client.on("guildScheduledEventUpdate", async (event) => {
  
});

// Event listener for when a user is added to a scheduled event in a guild
client.on("guildScheduledEventUserAdd", async (event, user) => {
  
});

// Event listener for when a user is removed from a scheduled event in a guild
client.on("guildScheduledEventUserRemove", async (event, user) => {
  
});

// Event listener for when a new sticker is created in a guild
client.on("stickerCreate", async (sticker) => {
  
});

// Event listener for when a sticker is deleted from a guild
client.on("stickerDelete", async (sticker) => {
  
});

// Event listener for when a sticker is updated in a guild
client.on("stickerUpdate", async (oldSticker, newSticker) => {
  
});

// Event listener for when a guild becomes unavailable
client.on("guildUnavailable", async (guild) => {
  
});

// Event listener for when a guild's information is updated
client.on("guildUpdate", async (oldGuild, newGuild) => {
  
});


// Event listener for invalidated event
client.on("invalidated", async () => {
  
});

// Event listener for when a new invite is created
client.on("inviteCreate", async (invite) => {
  
});

// Event listener for when an invite is deleted
client.on("inviteDelete", async (invite) => {
  
});


// Event listener for presence update
client.on("presenceUpdate", async (oldPresence, newPresence) => {
  
});

// Event listener for shard disconnect
client.on("shardDisconnect", async (event, shardID) => {
  
});

// Event listener for shard error
client.on("shardError", async (error, shardID) => {
  
});

// Event listener for shard ready
client.on("shardReady", async (shardID) => {
  
});

// Event listener for shard reconnecting
client.on("shardReconnecting", async (shardID) => {
  
});

// Event listener for shard resume
client.on("shardResume", async (shardID, replayedEvents) => {
  
});

// Event listener for stage instance creation
client.on("stageInstanceCreate", async (stageInstance) => {
  
});

// Event listener for stage instance deletion
client.on("stageInstanceDelete", async (stageInstance) => {
  
});

// Event listener for stage instance update
client.on("stageInstanceUpdate", async (oldStageInstance, newStageInstance) => {
  
});

// Event listener for thread creation
client.on("threadCreate", async (thread) => {
  
});

// Event listener for thread deletion
client.on("threadDelete", async (thread) => {
  
});

// Event listener for thread list synchronization
client.on("threadListSync", async (threads) => {
  
});

// Event listener for thread members update
client.on("threadMembersUpdate", async (oldMembers, newMembers) => {
  
});

// Event listener for thread member update
client.on("threadMemberUpdate", async (oldMember, newMember) => {
  
});

// Event listener for thread update
client.on("threadUpdate", async (oldThread, newThread) => {
  
});

// Event listener for typing start
client.on("typingStart", async (channel, user) => {
  
});

// Event listener for user information update
client.on("userUpdate", async (oldUser, newUser) => {
  
});

// Event listener for voice server update
client.on("voiceServerUpdate", async (data) => {
  
});

// Event listener for voice state update
client.on("voiceStateUpdate", async (oldState, newState) => {
  
});

// Event listener for warnings
client.on("warn", async (info) => {
  
});

// Event listener for webhook update
client.on("webhookUpdate", async (channel) => {
  
});


}
