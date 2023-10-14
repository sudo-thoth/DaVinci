const client = require(`../../index.js`);

if (client) {

  // event listener for any interaction
  client.on("interactionCreate", async (interaction) => {

    // BUTTONS
    if (interaction.isButton()) {


    }
    // MODALS
    if (interaction.isModalSubmit()) {
      

    }

});

// event listener for when a user joins a server
client.on("guildMemberAdd", async (member) => {

});

// event listener for when a user leaves a server
client.on("guildMemberRemove", async (member) => {

});

// event listener for when a user is banned from a server
client.on("guildBanAdd", async (guild, user) => {

});

// event listener for when a user is unbanned from a server
client.on("guildBanRemove", async (guild, user) => {

});

// event listener for when a user joins a voice channel
client.on("voiceStateUpdate", async (oldState, newState) => {

});

// event listener for when a user sends a message
client.on("messageCreate", async (message) => {

});

// event listener for when a user edits a message
client.on("messageUpdate", async (oldMessage, newMessage) => {

});

// event listener for when a user deletes a message
client.on("messageDelete", async (message) => {

});

// event listener for when a user deletes multiple messages
client.on("messageDeleteBulk", async (messages) => {

});

// event listener for when a user reacts to a message
client.on("messageReactionAdd", async (messageReaction, user) => {

});

// event listener for when a user removes a reaction from a message
client.on("messageReactionRemove", async (messageReaction, user) => {

});

// event listener for when a user removes all reactions from a message
client.on("messageReactionRemoveAll", async (message) => {

});

// event listener for when a user updates their profile
client.on("userUpdate", async (oldUser, newUser) => {

});

// event listener for when a user updates their presence
client.on("presenceUpdate", async (oldPresence, newPresence) => {

});

// event listener for when a user updates their avatar
client.on("userAvatarUpdate", async (user, oldAvatar, newAvatar) => {

});

// event listener for when a user updates their username
client.on("userNameUpdate", async (user, oldUsername, newUsername) => {

});

// event listener for when a user updates their discriminator
client.on("userDiscriminatorUpdate", async (user, oldDiscriminator, newDiscriminator) => {

});

// event listener for when a user updates their flags
client.on("userFlagsUpdate", async (user, oldFlags, newFlags) => {

});

// event listener for when a user updates their banner
client.on("userBannerUpdate", async (user, oldBanner, newBanner) => {

});

// event listener for when a user updates their accent color
client.on("userAccentColorUpdate", async (user, oldAccentColor, newAccentColor) => {

});

// event listener for when a user updates their bio
client.on("userBioUpdate", async (user, oldBio, newBio) => {

});

// event listener for when a user updates their banner
client.on("userBannerUpdate", async (user, oldBanner, newBanner) => {

});

// event listener for when an audit log entry is created
client.on('guildAuditLogEntryCreate', async (auditLogEntry, guild) => {

});

}
