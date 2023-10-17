/**
 * Produces an object containing arrays of properties for a given guild, excluding permanent bans.
 *
 * @param {Object} guild - The guild object to retrieve properties for.
 * @returns {Object} - An object containing arrays of properties for the guild.
 */
async function guildObjectArrayProperties (guild){
  // construct the channels array
  const channels = [];
  const bans = [];
  const roles = [];
  const commands = [];
  const emojis = [];
  const invites = [];
  const members = [];
  const stickers = [];

try {
    // fetch all channels in the guild
    const guildChannels = await guild.channels.fetch();
    for (let channel of guildChannels) {
      // since its a collection, we need to get the channel object
      channel = channel[1];
      // construct the channel object
      const channelObject = {
        channelID: channel?.id,
        channelName: channel?.name,
        createdAt: channel?.createdAt,
        serverName: channel?.guild?.name,
        serverID: channel?.guild?.id,
        createdTimestamp: channel?.createdTimestamp,
        members: [],
        parentCategoryName: channel?.parent?.name,
        parentCategoryID: channel?.parent?.id,
        position: channel?.position,
        rawPosition: channel?.rawPosition,
        type: {
          name:
            channel?.type === 0
              ? "text"
              : channel?.type === 2
              ? "voice"
              : channel?.type === 4
              ? "category"
              : channel?.type === 5
              ? "news"
              : channel?.type === 6
              ? "store"
              : "unknown",
          id: channel?.type,
        },
      };
      // add the channel object to the channels array
      channels.push(channelObject);
    }
} catch (error) {
  console.log(error)
  
}

 try {
   // fetch all roles in the guild
   const guildRoles = await guild.roles.fetch();
   for (let role of guildRoles) {
     role = role[1];
     // construct the role object
     const roleObject = {
       roleID: role?.id,
       roleName: role?.name,
       roleColor: role?.hexColor,
       rolePosition: role?.position,
       rolePermissions: role?.permissions,
       roleManaged: role?.managed,
       roleMentionable: role?.mentionable,
     };
     // add the role object to the roles array
     roles.push(roleObject);
   }
 } catch (error) {
  console.log(error)
  
 }

 try {
   // fetch all members in the guild
   const guildMembers = await guild.members.fetch();
   for (let member of guildMembers) {
     member = member[1];
     // construct the member object
     const memberObject = {
       userID: member?.id,
       username: member?.user?.username,
       discriminator: member?.user?.discriminator,
       nickname: member?.nickname,
       joinedTimestamp: member?.joinedTimestamp,
       joinedAt: member?.joinedAt,
       roles: member?.roles?.cache?.map((role) => role.id),
       voice: {
         channelID: member?.voice?.channelID,
         deaf: member?.voice?.deaf,
         mute: member?.voice?.mute,
         selfDeaf: member?.voice?.selfDeaf,
         selfMute: member?.voice?.selfMute,
         streaming: member?.voice?.streaming,
         suppress: member?.voice?.suppress,
       },
     };
     // add the member object to the members array
     members.push(memberObject);
   }
 } catch (error) {
  console.log(error)
 }

  try {
    // fetch all emojis in the guild
    const guildEmojis = await guild.emojis.fetch();
    for (let emoji of guildEmojis) {
      emoji = emoji[1];
      // construct the emoji object
      const emojiObject = {
        emojiID: emoji?.id,
        emojiName: emoji?.name,
        emojiURL: emoji?.url,
        emojiAnimated: emoji?.animated,
      };
      // add the emoji object to the emojis array
      emojis.push(emojiObject);
    }
  } catch (error) {
    console.log(error)
  }

  try {
    // fetch all invites in the guild
    const guildInvites = await guild.invites.fetch();
    for (let invite of guildInvites) {
      invite = invite[1];
      // construct the invite object
      const inviteObject = {
        inviteCode: invite?.code,
        inviteChannel: invite?.channel?.name,
        inviteChannelID: invite?.channel?.id,
        inviteUses: invite?.uses,
        inviteMaxUses: invite?.maxUses,
        inviteMaxAge: invite?.maxAge,
        inviteExpiresAt: invite?.expiresAt,
        inviteCreatedAt: invite?.createdAt,
        inviteTemporary: invite?.temporary,
        inviteUnique: invite?.unique,
        inviteInviter: invite?.inviter?.username,
        inviteInviterID: invite?.inviter?.id,
      };
      // add the invite object to the invites array
      invites.push(inviteObject);
    }
  } catch (error) {
    console.log(error)
  }

  // fetch all stickers in the guild
  try {
    // fetch all stickers in the guild
    const guildStickers = await guild.stickers.fetch();
    for (let sticker of guildStickers) {
      sticker = sticker[1];
      // construct the sticker object
      const stickerObject = {
        stickerID: sticker?.id,
        stickerName: sticker?.name,
        stickerDescription: sticker?.description,
        stickerPackID: sticker?.packID,
        stickerFormatType: sticker?.formatType,
        stickerAvailable: sticker?.available,
        stickerGuildID: sticker?.guildID,
        stickerUser: {
          userID: sticker?.user?.id,
          username: sticker?.user?.username,
          discriminator: sticker?.user?.discriminator,
          avatarURL: sticker?.user?.avatarURL(),
        },
      };
      // add the sticker object to the stickers array
      stickers.push(stickerObject);
    }
  } catch (error) {
    console.log(error)
  }

  // construct the guildObjectArray object
  const guildObjectArray = {
    channels,
    bans,
    roles,
    commands,
    emojis,
    invites,
    members,
    stickers,
  };

  return guildObjectArray;
};

module.exports = guildObjectArrayProperties;
