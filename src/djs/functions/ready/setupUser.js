const client = require("../../index.js");
const getUser = require("./getUser.js");
const mongoose = require("mongoose");

/**
 * Sets up a user in the database.
 *
 * @param {Object|string} user - The user object or user ID to set up.
 * @returns {Object} - The data object for the user.
 */
async function setupUser(user) {
  let data;
  // check if user is not obj then fetch user as if user var is user id
  if (!(typeof user === "object") || typeof user === "string") {
    user = client.users.cache.get(user);
  }

  try {
    // get the data object for the user from the database
    data = await getUser(user);
  } catch (error) {
    console.log(
      `an error occurred while trying to get the data from the database: `,
      error
    );
  }

  if (data == null) {
    // if the user is not found in the db, set up the user
    const obj = {
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
      // create the user object in the database
      await client.usersDB.create(obj);
      console.log(`created & saved to db`);
    } catch (error) {
      console.log(error);
    }

    try {
      // get the data object for the user from the database
      data = await client.getUser(user);
    } catch (error) {
      console.log(
        `an error occurred while trying to get the data from the database: `,
        error
      );
    }
    return data;
  } else {
    // if the user is found in the db, update the user object
    const obj = {
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
      // update the user object in the database
      data = await client.usersDB.findOneAndUpdate({ userID: user.id }, obj);
      // console.log(`${user.username}-${user.id} updated in db`);
    } catch (error) {
      console.log(error);
    }
    return data;
  }
};

client.setupUser = setupUser;

module.exports = setupUser;
