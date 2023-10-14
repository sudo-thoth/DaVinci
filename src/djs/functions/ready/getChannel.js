const client = require("../../index.js");
// TODO: Seperate the functions into seperate files

client.getChannel = async (channel) => {
    let data;
    // searching channels db for the channel
    try {
      data = await client.channelsDB.findOne({
        channelID: `${channel.id}`,
        serverID: `${channel.guild.id}`,
      });
    } catch (error) {
      console.log(
        `an error occurred while trying to get the data from the database: `,
        error
      );
    }
    if (data == null) {
      // console.log(data)
      // console.log(`[ data ] NOT found in query`);

      return null;
    } else {
      // console.log(data)
      // console.log(`[ data ] found in query: `);
      return data;
    }
  };
  client.setupChannel = async (channel) => {
    // save the message & links & files to the db
    let data;
    if (!(typeof channel === "object") || typeof channel === "string") {
      channel = client.channels.cache.get(channel);
    }

    try {
      data = await client.getChannel(channel);
    } catch (error) {
      console.log(
        `an error occurred while trying to get the data from the database: `,
        error
      );
    }
    if (data == null) {
      // console.log(data)
      // console.log(`[ data ] NOT found in query`);

      let obj = {
        _id: `${new mongoose.Types.ObjectId()}`,
        channelID: `${channel?.id}`,
        channelName: `${channel?.name}`,
        createdAt: `${channel?.createdAt}`,
        serverName: `${channel?.guild?.name}`,
        serverID: `${channel?.guild?.id}`,
        manageable: channel?.manageable,
        viewable: channel?.viewable,
        parentCategoryName: `${channel?.parent?.name}`,
        parentCategoryID: `${channel?.parentId}`,
        url: `${channel?.url}`,
        copyright_filterOn: false,
        attachments_filterOn: false,
        links_filterOn: false,
        deletedMessages: [],
      };
      try {
        await client.channelsDB.create(obj);
        console.log(`created & saved to db`);
      } catch (error) {
        scripts.logError(error);
        await throwNewError({
          action: `copyright content not saved`,
          interaction: interaction,
          error: error,
        });
      }

      try {
        data = await client.getChannel(channel);
      } catch (error) {
        console.log(
          `an error occurred while trying to get the data from the database: `,
          error
        );
      }
      return data;
    } else {
      // console.log(data)
      // update the channel data
      let obj = {
        _id: `${data._id}`,
        channelID: `${channel?.id}`,
        channelName: `${channel?.name}`,
        createdAt: `${channel?.createdAt}`,
        serverName: `${channel?.guild?.name}`,
        serverID: `${channel?.guild?.id}`,
        manageable: channel?.manageable,
        viewable: channel?.viewable,
        parentCategoryName: `${channel?.parent?.name}`,
        parentCategoryID: `${channel?.parentId}`,
        url: `${channel?.url}`,
        attachments_filterOn: data.attachments_filterOn,
        links_filterOn: data.links_filterOn,
        deletedMessages: data.deletedMessages,
      };
      try {
        data = await client.channelsDB.findOneAndUpdate(
          { channelID: channel.id },
          obj
        );
        // console.log(`${channel.name}-${channel.id} updated in db`);
      } catch (error) {
        scripts.logError(error);
      }
      // console.log(`[ data ] found in query: `);
      return data;
    }
  };

  client.getUser = async (user) => {
    let data;
    // searching users db for the user
    // check if user is not obj then fetch user as if user var is user id
    if (!(typeof user === "object") || typeof user === "string") {
      user = client.users.cache.get(user);
    }

    try {
      data = await client.usersDB.findOne({ userID: `${user.id}` });
    } catch (error) {
      console.log(
        `an error occurred while trying to get the data from the database: `,
        error
      );
    }
    if (data == null) {
      // console.log(data)
      // console.log(`[ data ] NOT found in query`);

      return null;
    } else {
      // console.log(data)
      // console.log(`[ data ] found in query: `);
      return data;
    }
  };
  client.setupUser = async (user) => {
    // save the message & links & files to the db
    let data;

    try {
      data = await client.getUser(user);
    } catch (error) {
      console.log(
        `an error occurred while trying to get the data from the database: `,
        error
      );
    }
    if (!(typeof user === "object") || typeof user === "string") {
      user = client.users.cache.get(user);
    }
    if (data == null) {
      // console.log(data)
      // console.log(`[ data ] NOT found in query`);
      /**
        
        {
          _id: Schema.Types.ObjectId,
          userID: { type: String, required: true },
          username: String,
          accentColor: String,
          avatarURL: String,
          bannerURL: String,
          avatar: String,
          banner: String,
          bot: Boolean,
          createdTimestamp: Number,
          defaultAvatarURL: String,
          discriminator: String,
          hexAccentColor: String,
          tag: String,
          createdAt: String,
          // an array of server objects with key as server name and value as server id
          servers: [ {serverName: String, serverID: String,
          member: {
            avatar: String,
            
            avatarURL: String,
            
            displayColor: String,
            displayHexColor: String,
            displayName: String,
            joinedAt: String,
            joinedTimestamp: Number,
            nickname: String,
            roles: [ {roleName: String, roleID: String} ],
            managable: Boolean,
            viewable: Boolean,
            permissions: [ {permissionName: String, permissionID: String} ],
            serverOwner: Boolean,
          },
          } ],
        }
        
         */
      let obj = {
        _id: `${new mongoose.Types.ObjectId()}`,
        userID: `${user.id}`,
        username: `${user.username}`,
        accentColor: `${user.accentColor}`,
        avatarURL: `${user.avatarURL()}`,
        bannerURL: `${user.bannerURL()}`,
        avatar: `${user.avatar}`,
        banner: `${user.banner}`,
        bot: user.bot,
        createdTimestamp: user.createdTimestamp,
        defaultAvatarURL: `${user.defaultAvatarURL}`,
        discriminator: `${user.discriminator}`,
        hexAccentColor: `${user.hexAccentColor}`,
        tag: `${user.tag}`,
        createdAt: `${user.createdAt}`,
        servers: [],
      };

      // calculate servers array and add to obj
      // get every server the user and the bot share together
      let servers = [];
      let guilds = [];

      client.guilds.cache.forEach((guild) => {
        if (guild.members.cache.has(user.id)) {
          guilds.push(guild);
        }
      });

      for (let guild of guilds) {
        // get the users member object for the current guild
        let member = guild.members.cache.get(user.id);

        let serverObj = {
          serverName: `${guild.name}`,
          serverID: `${guild.id}`,
          member: {
            avatar: `${member.avatarURL()}`,
            bannable: member.bannable,
            avatarURL: `${member.avatarURL()}`,
            displayColor: `${member.displayColor}`,
            displayHexColor: `${member.displayHexColor}`,
            displayName: `${member.displayName}`,
            joinedAt: `${member.joinedAt}`,
            joinedTimestamp: `${member.joinedTimestamp}`,
            nickname: `${member.nickname}`,
            roles: [],
            managable: member.manageable,
            viewable: member.viewable,
            permissions: [],
            serverOwner: member.guild.owner,
          },
        };
        // calculate roles the user/member has array and add to serverObj
        let roles = [];
        let djsRoles = member._roles;
        for (let role of djsRoles) {
          let roleObj = {
            roleName: `${role.name}`,
            roleID: `${role.id}`,
          };
          roles.push(roleObj);
        }
        serverObj.member.roles = roles;

        // calculate permissions the user/member has array and add to serverObj
        let permissions = [];
        let djsPermissions = member?.permissions || [];
        for (let permission of djsPermissions) {
          let permissionObj = {
            permissionName: `${permission.name}`,
            permissionID: `${permission.id}`,
          };
          permissions.push(permissionObj);
        }
        serverObj.member.permissions = permissions;

        servers.push(serverObj);
      }

      obj.servers = servers;

      try {
        await client.usersDB.create(obj);
        console.log(`created & saved to db`);
      } catch (error) {
        scripts.logError(error, "error creating user in db");
        //await throwNewError({ action: `copyright content not saved`, interaction: interaction, error: error });
      }

      try {
        data = await client.getUser(user);
      } catch (error) {
        console.log(
          `an error occurred while trying to get the data from the database: `,
          error
        );
      }
      return data;
    } else {
      // console.log(data)
      // update the user data

      let obj = {
        _id: `${data._id}`,
        userID: `${user.id}`,
        username: `${user.username}`,
        accentColor: `${user.accentColor}`,
        avatarURL: `${user.avatarURL()}`,
        bannerURL: `${user.bannerURL()}`,
        avatar: `${user.avatar}`,
        banner: `${user.banner}`,
        bot: user.bot,
        createdTimestamp: user.createdTimestamp,
        defaultAvatarURL: `${user.defaultAvatarURL}`,
        discriminator: `${user.discriminator}`,
        hexAccentColor: `${user.hexAccentColor}`,
        tag: `${user.tag}`,
        createdAt: `${user.createdAt}`,
        servers: [],
      };

      // calculate servers array and add to obj
      // get every server the user and the bot share together

      let servers = [];
      let guilds = [];

      client.guilds.cache.forEach((guild) => {
        if (guild.members.cache.has(user.id)) {
          guilds.push(guild);
        }
      });

      for (let guild of guilds) {
        // get the users member object for the current guild
        let member = guild.members.cache.get(user.id);

        let serverObj = {
          serverName: `${guild.name}`,
          serverID: `${guild.id}`,
          member: {
            avatar: `${member.avatarURL()}`,
            bannable: member.bannable,
            avatarURL: `${member.avatarURL()}`,
            displayColor: `${member.displayColor}`,
            displayHexColor: `${member.displayHexColor}`,
            displayName: `${member.displayName}`,
            joinedAt: `${member.joinedAt}`,
            joinedTimestamp: `${member.joinedTimestamp}`,
            nickname: `${member.nickname}`,
            roles: [],
            managable: member.manageable,
            viewable: member.viewable,
            permissions: [],
            serverOwner: member.guild.owner,
          },
        };
        // calculate roles the user/member has array and add to serverObj
        let roles = [];
        let djsRoles = member._roles;
        for (let role of djsRoles) {
          let roleObj = {
            roleName: `${role.name}`,
            roleID: `${role.id}`,
          };
          roles.push(roleObj);
        }
        serverObj.member.roles = roles;

        // calculate permissions the user/member has array and add to serverObj
        let permissions = [];
        let djsPermissions = member?.permissions || [];
        if (djsPermissions.length > 0) {
          for (let permission of djsPermissions) {
            let permissionObj = {
              permissionName: `${permission.name}`,
              permissionID: `${permission.id}`,
            };
            permissions.push(permissionObj);
          }
        }
        serverObj.member.permissions = permissions;

        servers.push(serverObj);
      }

      obj.servers = servers;

      try {
        data = await client.usersDB.findOneAndUpdate(
          { userID: user.id },
          obj
        );
        // console.log(`${user.username}-${user.id} updated in db`);
      } catch (error) {
        scripts.logError(error, "error updating user in db");
      }

      // console.log(`[ data ] found in query: `);
      return data;
    }
  };
  // function to setup every server in the database upon login
  client.setupServers = async (client) => {
    // get all the servers the bot is in
    const guilds = client.guilds.cache.map((guild) => guild);

    for (const guild of guilds) {
      client.localDB[guild.name] = {}; // Create the guild-specific object
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
        }
      };

      // for each server, check if it exists in the database
      // use the server id to check
      let guildData;
      try {
        guildData = await client.guildsDB.find({ serverID: guild.id });
      } catch (error) {
        console.log(
          error,
          "error in setupServer function in schema_servers.js"
        );
      }
      if (guildData?.length > 0) {
        guildData = guildData[0]._doc;
        // if the server exists in the database, update the server data
        // update the guildObject with the former permanent bans
        guildObject.permanentBans =
          Array?.from(guildData.permanentBans) || [];
        let {
          channels,
          bans,
          commands,
          emojis,
          invites,
          members,
          roles,
          stickers,
        } = guildObjectArrayProperties(guild);
        guildObject.channels = channels;
        guildObject.bans = bans;
        guildObject.commands = commands;
        guildObject.emojis = emojis;
        guildObject.invites = invites;
        guildObject.members = members;
        guildObject.roles = roles;
        guildObject.stickers = stickers;

        // for every filter property within the guildData.filters object, check if any of the properties arrays are not empty
        if (guildData.filters) {
          // if so, update the guildObject with the filters
          for (let filter in guildData.filters) {
            if (guildData.filters[filter].length > 0) {
              guildObject.filters[filter] = guildData.filters[filter];
            }
          }
        }

        // setup whitelist property
        guildObject.whitelist = guildData.whitelist;

        // check if any of the guildObject.members are on the permanent ban list, if so, kick and ban them
        // get the permanent bans array
        let permanentBans = guildObject.permanentBans;
        // get the guild members
        let guildMembers = guild.members.cache.map((member) => member);
        // search the array for the user id
        let found = false;
        for (let i = 0; i < permanentBans.length; i++) {
          let perma = permanentBans[i];
          let permaDoc = perma._doc;
          for (let j = 0; j < guildMembers.length; j++) {
            let member = guildMembers[j];
            if (permaDoc.user.id === member.id) {
              found = true;
              // kick the member
              try {
                await member.kick(permaDoc.reason);
              } catch (error) {
                console.log(
                  error,
                  "error kicking member in setupServer function in schema_servers.js"
                );
              }
              // ban the member
              try {
                await guild.bans.create(permaDoc.user.id, {
                  reason: permaDoc.reason,
                });
              } catch (error) {
                console.log(
                  error,
                  "error banning member in setupServer function in schema_servers.js"
                );
              }
              break;
            }
          }
        }

        if (found) {
          // update the guildObject without the banned members
          const updatedGuildProperties = await guildObjectArrayProperties(
            guild
          );
          guildObject.members = updatedGuildProperties?.members;
          guildObject.bans = updatedGuildProperties?.bans;
        }

        try {
          client.localGuilds.set(guild.id, guildObject);
          client.localDB[`${guild.name}`].guildObject = guildObject;
          await client.guildsDB.findOneAndUpdate(
            { serverID: guild.id },
            guildObject
          );
          // console.log(
          //   `Server data updated for ${guild.name} with id ${guild.id}`
          // );
        } catch (error) {
          console.log(
            error,
            "error in setupServer function in schema_servers.js"
          );
        }
      } else {
        // if the server does not exist in the database, create a new server data object
        try {
          // add the mongo id to the guild object
          guildObject._id = new mongoose.Types.ObjectId();
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
          guildObject.channels = channels;
          guildObject.bans = bans;
          guildObject.commands = commands;
          guildObject.emojis = emojis;
          guildObject.invites = invites;
          guildObject.members = members;
          guildObject.roles = roles;
          guildObject.stickers = stickers;
          guildObject.permanentBans = [];
          client.localGuilds.set(guild.id, guildObject);
          client.localDB[`${guild.name}`].guildObject = guildObject;
          await client.guildsDB.create(guildObject);
          // console.log(
          //   `New server data created for ${guild.name} with id ${guild.id}`
          // );
        } catch (error) {
          console.log(
            error,
            "error in setupServer function in schema_servers.js"
          );
        }
      }
    }
    console.log(`Server data setup complete for all Guilds from the client`);
  };
  client.setupUsers = async (client) => {
    // get all the users the bot is in
    const users = client.users.cache.map((user) => user);

    for (const user of users) {
      // construct the user object
      client.setupUser(user);
    }
    console.log(`User data setup complete for all Users from the client`);
  };
  client.setupChannels = async (client) => {
    // get all the channels the bot is in
    const channels = client.channels.cache.map((channel) => channel);

    for (const channel of channels) {
      client.localDB[channel.guild.name].channels = {}; // Create the guild-specific object
      client.localDB[channel.guild.name].channels[channel.name] = {}; // Create the channel-specific object
      // construct the channel object
      client.setupChannel(channel);
    }
    console.log(
      `Channel data setup complete for all Channels from the client`
    );
  };
  client.getServer = async (guild) => {
    let data;
    // searching servers db for the server
    // check if guild is not obj then fetch guild as if guild var is guild id
    if (!(typeof guild === "object") || typeof guild === "string") {
      guild = client.guilds.cache.get(guild);
    }

    try {
      data = await client.guildsDB.findOne({ serverID: `${guild.id}` });
    } catch (error) {
      console.log(
        `an error occurred while trying to get the data from the database: `,
        error
      );
    }
    if (data == null) {
      // console.log(data)
      // console.log(`[ data ] NOT found in query`);

      return null;
    } else {
      // console.log(data)
      // console.log(`[ data ] found in query: `);
      return data;
    }
  };
  client.setupServer = async (guild) => {
    // first check if the server is already in the database
    let data;
    try {
      data = await client.getServer(guild);
    } catch (error) {
      console.log(
        `an error occurred while trying to get the data from the database: `,
        error
      );
    }
    if (data !== null) {
      return data;
    } else {
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
        guildObject.channels = channels;
        guildObject.bans = bans;
        guildObject.commands = commands;
        guildObject.emojis = emojis;
        guildObject.invites = invites;
        guildObject.members = members;
        guildObject.roles = roles;
        guildObject.stickers = stickers;
        guildObject.permanentBans = [];
        data = await client.guildsDB.create(guildObject);
        // console.log(
        //   `New server data created for ${guild.name} with id ${guild.id}`
        // );
        return data;
      } catch (error) {
        console.log(
          error,
          "error in setupServer function in schema_servers.js"
        );
      }
    }
  };

  // a function that produces all guildObject array properties except permanentBans
  const guildObjectArrayProperties = async (guild) => {
    // construct the channels array
    const channels = [];
    const bans = [];
    const roles = [];
    const commands = [];
    const emojis = [];
    const invites = [];
    const members = [];
    const stickers = [];
    const guildChannels = await guild.channels.fetch();
    for (let channel of guildChannels) {
      // since its a collection, we need to get the channel object
      channel = channel[1];
      const channelObject = {
        channelID: channel?.id,
        channelName: channel?.name,
        createdAt: channel?.createdAt,
        createdTimestamp: channel?.createdTimestamp,
        members: [],
        parentCategoryName: channel?.parent?.name,
        parentCategoryID: channel?.parent?.id,
        position: channel?.position,
        rawPosition: channel?.rawPosition,
        type: {
          name:
            channel?.type === 0
              ? "GUILD_TEXT"
              : channel?.type === 1
              ? "DM"
              : channel?.type === 2
              ? "GUILD_VOICE"
              : channel?.type === 3
              ? "GROUP_DM"
              : channel?.type === 4
              ? "GUILD_CATEGORY"
              : channel?.type === 5
              ? "GUILD_ANNOUNCEMENT"
              : channel?.type === 10
              ? "ANNOUNCEMENT_THREAD"
              : channel?.type === 11
              ? "PUBLIC_THREAD"
              : channel?.type === 12
              ? "PRIVATE_THREAD"
              : channel?.type === 13
              ? "GUILD_STAGE_VOICE"
              : channel?.type === 14
              ? "GUILD_DIRECTORY"
              : channel?.type === 15
              ? "GUILD_FORUM"
              : channel?.type === 16
              ? "GUILD_MEDIA"
              : null, // 0 - GUILD_TEXT, 1 - DM, 2 - GUILD_VOICE, 3 - GROUP_DM, 4 - GUILD_CATEGORY, 5 - GUILD_NEWS, 6 - GUILD_STORE, 10 - GUILD_NEWS_THREAD, 11 - GUILD_PUBLIC_THREAD, 12 - GUILD_PRIVATE_THREAD, 13 - GUILD_STAGE_VOICE, 14 - GUILD_DIRECTORY, 15 - GUILD_THREAD, 16 - GUILD_STAGE_VOICE
          value: channel?.type,
        },
        url: channel?.url,
        viewable: channel?.viewable,
        deletable: channel?.deletable,
        manageable: channel?.manageable,
      };
      const channelMembers = await channel?.members;
      // construct the members array
      if (channelMembers?.size > 0) {
        for (let member of channelMembers) {
          member = member[1];
          const memberObject = {
            id: member?.id,
            username: member?.user?.username,
            bot: member?.user?.bot,
          };
          channelObject.members.push(memberObject);
        }
      }
      channels.push(channelObject);
    }
    // construct the bans array

    let guildBans;
    try {
      if (guild?.members?.me?.permissions.has("ADMINISTRATOR")) {
        // construct the bans array
        try {
          guildBans = await guild.bans.fetch();
        } catch (error) {
          console.log(`error fetching bans from ${guild.name}`, error);
        }
        try {
          if (guildBans?.size > 0) {
            for (let ban of guildBans) {
              ban = ban[1];
              const banObject = {
                reason: ban?.reason,
                user: {
                  id: ban?.user?.id,
                  username: ban?.user?.username,
                  bot: ban?.user?.bot,
                },
              };
              bans.push(banObject);
            }
          }
        } catch (error) {
          console.log(error);
        }
        // construct the roles array

        const guildRoles = await guild.roles.fetch();
        try {
          if (guildRoles?.size > 0) {
            for (let role of guildRoles) {
              role = role[1];
              const roleObject = {
                id: role?.id,
                name: role?.name,
                createdAt: role?.createdAt,
                createdTimestamp: role?.createdTimestamp,
                editable: role?.editable,
                flags: role?.flags,
                hexColor: role?.hexColor,
                color: role?.color,
                hoist: role?.hoist,
                position: role?.position,
                rawPosition: role?.rawPosition,
                permissions: role?.permissions,
                managed: role?.managed,
                mentionable: role?.mentionable,
                icon: role?.icon,
                managed: role?.managed,
                members: [],
                tags: {
                  botId: role?.tags?.botId,
                  integrationId: role?.tags?.integrationId,
                  premiumSubscriberRole: role?.tags?.premiumSubscriberRole,
                  subscriptionListingId: role?.tags?.subscriptionListingId,
                  availableForPurchase: role?.tags?.availableForPurchase,
                  guildConnections: role?.tags?.guildConnections,
                },
                unicodeEmoji: role?.unicodeEmoji,
              };
              // construct the members array
              for (const member of role?.members) {
                const memberObject = {
                  id: member?.id,
                  username: member?.user?.username,
                  bot: member?.user?.bot,
                };
                roleObject.members.push(memberObject);
              }
              roles.push(roleObject);
            }
          }
        } catch (error) {
          console.log(error);
        }
        // construct the commands array

        const guildCommands = await guild.commands.fetch();
        try {
          if (guildCommands?.size > 0) {
            for (let command of guildCommands) {
              command = command[1];
              const commandObject = {
                name: command?.name,
                description: command?.description,
                applicationId: command?.applicationId,
                createdAt: command?.createdAt,
                createdTimestamp: command?.createdTimestamp,
                dmPermissions: command?.defaultPermission,
                id: command?.id,
                nsfw: command?.nsfw,
                type: {
                  name:
                    command?.type === 1
                      ? "CHAT_INPUT"
                      : command?.type === 2
                      ? "USER"
                      : command?.type === 3
                      ? "MESSAGE"
                      : null, // 1 - CHAT_INPUT, 2 - USER, 3 - MESSAGE
                  value: command?.type,
                },
                version: command?.version,
                defaultMemberPermissions: command?.defaultMemberPermissions,
                options: [],
              };
              // construct the options array
              for (const option of command?.options) {
                const optionObject = {
                  name: option?.name,
                  description: option?.description,
                  type: option?.type,
                  required: option?.required,
                  choices: [],
                };
                // construct the choices array
                for (const choice of option?.choices) {
                  const choiceObject = {
                    name: choice?.name,
                    value: choice?.value,
                  };
                  optionObject.choices.push(choiceObject);
                }
                commandObject.options.push(optionObject);
              }
              commands.push(commandObject);
            }
          }
        } catch (error) {
          console.log(error);
        }
        // construct the emojis array

        const guildEmojis = await guild.emojis.fetch();
        try {
          if (guildEmojis?.size > 0) {
            for (let emoji of guildEmojis) {
              emoji = emoji[1];
              const emojiObject = {
                name: emoji?.name,
                id: emoji?.id,
                identifier: emoji?.identifier,
                animated: emoji?.animated,
                available: emoji?.available,
                createdAt: emoji?.createdAt,
                createdTimestamp: emoji?.createdTimestamp,
                author: {
                  id: emoji?.author?.id,
                  username: emoji?.author?.username,
                  bot: emoji?.author?.bot,
                },
                deletable: emoji?.deletable,
                managed: emoji?.managed,
                requiresColons: emoji?.requiresColons,
                url: emoji?.url,
              };
              emojis.push(emojiObject);
            }
          }
        } catch (error) {
          console.log(error);
        }

        // construct the invites array

        const guildInvites = await guild.invites.fetch();
        try {
          if (guildInvites?.size > 0) {
            for (let invite of guildInvites) {
              invite = invite[1];
              const inviteObject = {
                code: invite?.code,
                channel: {
                  id: invite?.channel?.id,
                  name: invite?.channel?.name,
                },
                createdAt: invite?.createdAt,
                createdTimestamp: invite?.createdTimestamp,
                deletable: invite?.deletable,
                expiresAt: invite?.expiresAt,
                expiresTimestamp: invite?.expiresTimestamp,
                maxAge: invite?.maxAge, // in seconds
                maxUses: invite?.maxUses,
                temporary: invite?.temporary,
                url: invite?.url,
                uses: invite?.uses,
                inviter: {
                  id: invite?.inviter?.id,
                  username: invite?.inviter?.username,
                  bot: invite?.inviter?.bot,
                },
              };
              invites.push(inviteObject);
            }
          }
        } catch (error) {
          console.log(error);
        }

        // construct the members array

        const guildMembers = await guild.members.fetch();
        try {
          if (guildMembers?.size > 0) {
            for (let member of guildMembers) {
              member = member[1];
              const memberObject = {
                id: member?.id,
                username: member?.user?.username,
                bot: member?.user?.bot,
              };
              members.push(memberObject);
            }
          }
        } catch (error) {
          console.log(error);
        }

        // construct the stickers array

        const guildStickers = await guild.stickers.fetch();
        try {
          if (guildStickers?.size > 0) {
            for (let sticker of guildStickers) {
              sticker = sticker[1];
              const stickerObject = {
                name: sticker?.name,
                id: sticker?.id,
                description: sticker?.description,
                createdAt: sticker?.createdAt,
                createdTimestamp: sticker?.createdTimestamp,
                packId: sticker?.packId,
                partial: sticker?.partial,
                available: sticker?.available,
                guildId: sticker?.guildId,
                format: {
                  name:
                    sticker?.format === 1
                      ? "PNG"
                      : sticker?.format === 2
                      ? "APNG"
                      : sticker?.format === 3
                      ? "LOTTIE"
                      : sticker?.format === 4
                      ? "GIF"
                      : null, // 1 - PNG, 2 - APNG, 3 - LOTTIE, 4 - GIF
                  value: sticker?.format,
                }, // 1 - PNG, 2 - APNG, 3 - LOTTIE, 4 - GIF
                sortValue: sticker?.sortValue,
                tags: sticker?.tags,
                type: {
                  value: sticker?.type,
                  name:
                    sticker?.type === 1
                      ? "STANDARD"
                      : sticker?.type === 2
                      ? "GUILD"
                      : null,
                }, // 1 - STANDARD, 2 - GUILD
                user: {
                  id: sticker?.user?.id,
                  username: sticker?.user?.username,
                  bot: sticker?.user?.bot,
                },
                url: sticker?.url,
              };
              stickers.push(stickerObject);
            }
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log(
          `bot does not have ADMIN permission to from ${guild.name}-${guild.id}`
        );
      }
    } catch (error) {
      console.log(
        `bot does not have ADMIN permission to from ${guild.name}-${guild.id}`,
        error
      );
    }
    // return the an object of the guild object properties
    return {
      channels,
      bans,
      commands,
      emojis,
      invites,
      members,
      roles,
      stickers,
    };
  };

  try {
    // setup all servers in the database
    await client.setupServers(client);
    // setup all users in the database
    await client.setupUsers(client);
    // setup all channels in the database
    await client.setupChannels(client);
  } catch (error) {
    console.log(error, "error in setupServers, setupUsers, setupChannels");
  }