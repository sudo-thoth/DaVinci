const client = require("../../index.js");
const guildObjectArrayProperties = require("./guildObjectArrayProperties.js");
const getServer = require("./getServer.js");
const mongoose = require("mongoose");

/**
 * Sets up a server in the database.
 *
 * @param {Object|string} guild - The guild object or guild ID to set up.
 * @returns {Object} - The data object for the guild.
 */
async function setupServer(guild){
  // first check if the server is already in the database
  let data;
  try {
    data = await getServer(guild);
  } catch (error) {
    console.log(
      `an error occurred while trying to get the data from the database: `,
      error
    );
  }
  if (data !== null && data !== undefined) {
    // if the server is already in the database, return the data object for the server
    return data;
  } else {
    // if the server is not in the database, set up the server
    if (!(typeof guild === "object") || typeof guild === "string") {
      guild = client.guilds.cache.get(guild);
    }

    // construct the guild object
    const guildObject = {
      createdAt: guild?.createdAt,
      createdTimestamp: guild?.createdTimestamp,
      serverName: guild?.name,
      serverID: guild?.id,
      description: guild?.description,
      nameAcronym: guild?.nameAcronym, // The acronym that shows up in place of a guild icon
      discoverySplash: guild?.discoverySplash, // The hash of the guild discovery splash image
      url: guild?.url,
      applicationId: guild?.applicationId,
      memberCount: guild?.memberCount,
      available: guild?.available,
      features: guild?.features,
      icon: guild?.icon,
      banner: guild?.banner,
      joinedAt: guild?.joinedAt,
      joinedTimestamp: guild?.joinedTimestamp,
      large: guild?.large, // 50 members or more
      maximumBitrate: guild?.maximumBitrate,
      maximumMembers: guild?.maximumMembers,
      maximumPresences: guild?.maximumPresences, // The maximum amount of presences the guild can have (this is null for all but the largest of guilds)
      maxStageVideoChannelUsers: guild?.maxStageVideoChannelUsers, // The maximum amount of users allowed in a stage video channel.
      maxVideoChannelUsers: guild?.maxVideoChannelUsers, // The maximum amount of users allowed in a video channel.
      partnered: guild?.partnered, // Whether the guild is partnered
      preferredLocale: guild?.preferredLocale, // The preferred locale of a guild with the "PUBLIC" feature; used in server discovery and notices from Discord; defaults to "en-US"
      premiumProgressBarEnabled: guild?.premiumProgressBarEnabled, //Whether this guild has its premium (boost) progress bar enabled; aka Whether the server widget displays "Server Boost level" messages
      premiumSubscriptionCount: guild?.premiumSubscriptionCount, // The total number of users currently boosting this server
      commandStyle: "slash", // Default command style is slash, but can be changed to prefix or both
      commandPrefix: ",",
      explicitContentFilter: {
        name:
          guild?.explicitContentFilter === 0
            ? "DISABLED"
            : guild?.explicitContentFilter === 1
            ? "MEMBERS_WITHOUT_ROLES"
            : guild?.explicitContentFilter === 2
            ? "ALL_MEMBERS"
            : null, // 0 - DISABLED, 1 - MEMBERS_WITHOUT_ROLES, 2 - ALL_MEMBERS
        value: guild?.explicitContentFilter,
      },
      mfaLevel: {
        // The required MFA level for this guild; 0 if none (guild has no MFA/2FA requirement for moderation actions), 1 if elevated (guild has a 2FA requirement for moderation actions)
        name:
          guild?.mfaLevel === 0
            ? "NONE"
            : guild?.mfaLevel === 1
            ? "ELEVATED"
            : null, // 0 - NONE, 1 - ELEVATED
        value: guild?.mfaLevel,
      },
      nsfwLevel: {
        // The guild NSFW level
        name:
          guild?.nsfwLevel === 0
            ? "NONE"
            : guild?.nsfwLevel === 1
            ? "EXPLICIT"
            : guild?.nsfwLevel === 2
            ? "SAFE"
            : guild?.nsfwLevel === 3
            ? "AGE_RESTRICTED"
            : null, // 0 - NONE, 1 - EXPLICIT, 2 - SAFE, 3 - AGE_RESTRICTED
        value: guild?.nsfwLevel,
      },
      owner: {
        id: guild?.ownerId,
        username: guild?.owner?.user?.username,
        bot: guild?.owner?.user?.bot,
      },
      premiumTier: {
        // The premium tier of this guild; 0 - NONE, 1 - TIER_1, 2 - TIER_2, 3 - TIER_3
        name:
          guild?.premiumTier === 0
            ? "NONE"
            : guild?.premiumTier === 1
            ? "TIER_1"
            : guild?.premiumTier === 2
            ? "TIER_2"
            : guild?.premiumTier === 3
            ? "TIER_3"
            : null, // 0 - NONE, 1 - TIER_1, 2 - TIER_2, 3 - TIER_3
        value: guild?.premiumTier,
      },
      publicUpdatesChannel: {
        id: guild?.publicUpdatesChannel?.id,
        name: guild?.publicUpdatesChannel?.name,
      },
      rulesChannel: {
        id: guild?.rulesChannel?.id,
        name: guild?.rulesChannel?.name,
      },
      safetyAlertsChannel: {
        id: guild?.safetyAlertsChannel?.id,
        name: guild?.safetyAlertsChannel?.name,
      },
      shard: {
        id: guild?.shard?.id,
        lastPingTimestamp: guild?.shard?.lastPingTimestamp,
        ping: guild?.shard?.ping,
        status: guild?.shard?.status,
      },
      splash: guild?.splash, // The hash of the guild invite splash image
      systemChannel: {
        id: guild?.systemChannel?.id,
        name: guild?.systemChannel?.name,
      },
      vanityURLCode: guild?.vanityURLCode,
      vanityURLUses: guild?.vanityURLUses,
      verificationLevel: {
        // The verification level of the guild
        name:
          guild?.verificationLevel === 0
            ? "NONE"
            : guild?.verificationLevel === 1
            ? "LOW"
            : guild?.verificationLevel === 2
            ? "MEDIUM"
            : guild?.verificationLevel === 3
            ? "HIGH"
            : guild?.verificationLevel === 4
            ? "VERY_HIGH"
            : null, // 0 - NONE, 1 - LOW, 2 - MEDIUM, 3 - HIGH, 4 - VERY_HIGH
        value: guild?.verificationLevel,
      },
      verified: guild?.verified, // Whether this guild is verified and has the "VERIFIED" badge
      widgetChannel: {
        id: guild?.widgetChannel?.id,
        name: guild?.widgetChannel?.name,
      },
      widgetEnabled: guild?.widgetEnabled, // Whether the server widget is enabled
      filters: {
        autorole: [],
      },
      whitelist: {
        autorole: [],
        permaBan: [],
      },
    };

    // if the server does not exist in the database, create a new server data object
    try {
      // add the mongo id to the guild object
      guildObject._id = new mongoose.Types.ObjectId();

      // get the guild object arrays
      const {
        channels,
        bans,
        commands,
        emojis,
        invites,
        members,
        roles,
        stickers,
      } = guildObjectArrayProperties(guild);

      // add the guild object arrays to the guild object
      guildObject.channels = channels;
      guildObject.bans = bans;
      guildObject.commands = commands;
      guildObject.emojis = emojis;
      guildObject.invites = invites;
      guildObject.members = members;
      guildObject.roles = roles;
      guildObject.stickers = stickers;
      guildObject.permanentBans = [];

      // create the server object in the database
      data = await client.guildsDB.create(guildObject);
      // console.log(
      //   `New server data created for ${guild.name} with id ${guild.id}`
      // );
      return data;
    } catch (error) {
      console.log(error, "error in setupServer function in schema_servers.js");
    }
  }
};

client.setupServer = setupServer;

module.exports = setupServer;
