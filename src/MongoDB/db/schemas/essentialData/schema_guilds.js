const { Schema, model } = require("mongoose");

const serverData = new Schema(
  {
    _id: Schema.Types.ObjectId,
    createdAt: String,
    createdTimestamp: Number,
    serverName: String,
    serverID: { type: String, required: true },
    description: String,
    nameAcronym: String, // The acronym that shows up in place of a guild icon
    discoverySplash: String, // The hash of the guild discovery splash image
    url: String,
applicationId: String,
memberCount: Number,
available: Boolean,
features: [String],
icon: String,
banner: String,
joinedAt: String,
joinedTimestamp: Number,
large: Boolean, // 50 members or more
maximumBitrate: Number,
maximumMembers: Number,
maximumPresences: Number, // The maximum amount of presences the guild can have (this is null for all but the largest of guilds)
maxStageVideoChannelUsers: Number, // The maximum amount of users allowed in a stage video channel.
maxVideoChannelUsers: Number, // The maximum amount of users allowed in a video channel.
partnered: Boolean, // Whether the guild is partnered
preferredLocale: String, // The preferred locale of a guild with the "PUBLIC" feature; used in server discovery and notices from Discord; defaults to "en-US"
premiumProgressBarEnabled: Boolean, //Whether this guild has its premium (boost) progress bar enabled; aka Whether the server widget displays "Server Boost level" messages 
premiumSubscriptionCount: Number, // The total number of users currently boosting this server
explicitContentFilter: {
    name: String,
    value: String,
},
mfaLevel: { // The required MFA level for this guild; 0 if none (guild has no MFA/2FA requirement for moderation actions), 1 if elevated (guild has a 2FA requirement for moderation actions)
    name: String,
    value: Number,
},

nsfwLevel: { // The guild NSFW level
    name: String, // 0 - NONE, 1 - EXPLICIT, 2 - SAFE, 3 - AGE_RESTRICTED
    value: Number,
},
owner: {
    id: String,
    username: String,
    bot: Boolean,
},
premiumTier: { // The premium tier of this guild; 0 - NONE, 1 - TIER_1, 2 - TIER_2, 3 - TIER_3
    name: String,
    value: Number,
},
publicUpdatesChannel: {
    id: String,
    name: String,
},
rulesChannel: {
    id: String,
    name: String,
},
safetyAlertsChannel: {
    id: String,
    name: String,
},
shard: {
    id: Number,
    lastPingTimestamp: Number,
    ping: Number,
    status: String,
},
splash: String, // The hash of the guild invite splash image

systemChannel: {
    id: String,
    name: String,
},
vanityURLCode: String,
vanityURLUses: Number,
verificationLevel: { // The verification level of the guild
    name: String, // 0 - NONE, 1 - LOW, 2 - MEDIUM, 3 - HIGH, 4 - VERY_HIGH
    value: Number,
},
verified: Boolean, // Whether this guild is verified and has the "VERIFIED" badge
widgetChannel: {
    id: String,
    name: String,
},
widgetEnabled: Boolean, // Whether the server widget is enabled
  channels: [
    {
        channelID: String,
        channelName: String,
        serverName: String,
        serverID: String,
        createdAt: String,
        createdTimestamp: Number,
        members: [
            {
                id: String,
                username: String,
                bot: Boolean,
            }
        ],
        parentCategoryName: String,
        parentCategoryID: String,
        position: Number,
        rawPosition: Number,
        type: {
            name: String,
            value: Number
        },
        url: String,
        viewable: Boolean,
        deletable: Boolean,
        manageable: Boolean,
}],
bans: [
    {
        reason: String,
        user: {
            id: String,
            username: String,
            bot: Boolean,
        }
    }
],
permanentBans: [
    {
        reason: String,
        user: {
            id: String,
            username: String,
            bot: Boolean,
        }
    }
],
commands: [ 
    {
        name: String,
        description: String,
        applicationId: String,
        createdAt: String,
        createdTimestamp: Number,
        dmPermissions: Boolean,
        id: String,
        nsfw: Boolean,
        type: {
            name: String,
            value: Number
        },
        version: String,
        defaultMemberPermissions: Number,
        options: [
            {
                name: String,
                description: String,
                type: String,
                required: Boolean,
                choices: [
                    {
                        name: String,
                        value: String,
                    }
                ]
            }
        ]
    }

],
emojis: [
    {
        name: String,
        id: String,
        identifier: String,
        animated: Boolean,
        available: Boolean,
        createdAt: String,
        createdTimestamp: Number,
        author: {
            id: String,
            username: String,
            bot: Boolean,
        },
        deletable: Boolean,
        managed: Boolean,
        requiresColons: Boolean,
        url: String,

    }
],
invites: [
    {
        code: String,
        channel: {
            id: String,
            name: String,
        },
        createdAt: String,
        createdTimestamp: Number,
        deletable: Boolean,
        expiresAt: String,
        expiresTimestamp: Number,
        maxAge: Number, // in seconds
        maxUses: Number,
        temporary: Boolean,
        url: String,
        uses: Number,
        inviter: {
            id: String,
            username: String,
            bot: Boolean,
        }
    }
],
members: [
    {
        id: String,
        username: String,
        bot: Boolean,
    }
],

roles: [
    {
        id: String,
        name: String,
        createdAt: String,
        createdTimestamp: Number,
        editable: Boolean,
        flags: [String],
        hexColor: String,
        color: Number,
        hoist: Boolean,
        position: Number,
        rawPosition: Number,
        permissions: Number,
        managed: Boolean,
        mentionable: Boolean,
        icon: String,
        managed: Boolean,
        members: [
            {
                id: String,
                username: String,
                bot: Boolean,
            }
        ],
        tags: {
            botId: String,
            integrationId: String,
            premiumSubscriberRole: Boolean,
            subscriptionListingId: String,
            availableForPurchase: Boolean,
            guildConnections: Boolean,
        },
        unicodeEmoji: String,
    }
],
stickers: [
    {
        name: String,
        id: String,
        description: String,
        createdAt: String,
        createdTimestamp: Number,
        packId: String,
        partial: Boolean,
        available: Boolean,
        guildId: String,
        format: {
            name: String,
            value: String,
        }, // 1 - PNG, 2 - APNG, 3 - LOTTIE, 4 - GIF
        sortValue: Number,
        tags: String,
        type: {
            name: String,
            value: String,
        }, // 1 - STANDARD, 2 - GUILD
        user: {
            id: String,
            username: String,
            bot: Boolean,
        },
        url: String,
    }
],
filters: {
    autorole: [
        {
           status: Boolean, // status
        roleId: String, // role id
    }
    ],
},
whitelist: {
    autorole: [
        {
              id: String, // member id
        username: String, // member username
        }
    ],
    permaBan: [
        {
                id: String, // member id
        username: String, // member username
        }
    ],
},

  },
  { collection: "servers" } // the database default collection name the schema will be stored in
);

// >> Parameters <<
// 1. Name of the model
// 2. Schema of the model
// 3. Name of the collection

module.exports = model("serverData", serverData, "servers");

