
// make a function run every 3 minutes while the bot is online and never stop
async function checkPermaBans(client) {
    // get all the servers the bot is in
    const guilds = client.guilds.cache.map((guild) => guild);
    // loop through each server
    for (const guild of guilds) {
      let guildObject = client.localGuilds.get(guild.id);

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
          if (
            permaDoc?.user?.id === member.id ||
            perma?.user?.id === member.id
          ) {
            found = true;
            // kick the member
            try {
              await member.kick(permaDoc?.reason || perma?.reason);
            } catch (error) {
              console.log(
                error,
                "error kicking member in setupServer function in schema_servers.js"
              );
            }
            // ban the member
            try {
              await guild.bans.create(permaDoc?.user?.id || perma?.user?.id, {
                reason: permaDoc?.reason || perma?.reason,
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
    }
  }
  async function checkAutoroles(client) {
    // get all the servers the bot is in
    const guilds = client.guilds.cache.map((guild) => guild);
    // loop through each server
    for (const guild of guilds) {
      let guildObject = client.localGuilds.get(guild.id);
      // get every filter property within the guildObject.filters object
      let filters = guildObject?.filters;
      if (filters) {
        // get the autorole filter
        let autorole = filters?.autorole;
        // check if the autorole filter is not empty
        if (autorole.length > 0) {
          // go through each role in the autorole filter and filter out the objects with the status of true
          let autoroleRoles = autorole.filter((role) => role.status === true);
          // check if the autoroleRoles array is not empty
          if (autoroleRoles.length > 0) {
            // for each role in the autoroleRoles array, add the role to any member in the guild that does not have the role
            for (let i = 0; i < autoroleRoles.length; i++) {
              // get the guild role object
              let role;
              try {
                role = await guild.roles.fetch(autoroleRoles[i].roleId);
              } catch (error) {
                console.log(
                  error,
                  "error fetching role in checkAutoroles function, check to make sure the role still exists in the server",
                  autoroleRoles[i].roleId
                );
              }
              // get the members in the guild
              let guildMembers = guild.members.cache.map((member) => member);

              // get members in the guild that do not have the role
              let membersWithoutRole = guildMembers.filter(
                (member) => !member.roles.cache.has(role.id)
              );

              

              // add the role to the members without the role
              for (let j = 0; j < membersWithoutRole.length; j++) {
                // check to make sure the member is not on the autorole whitelist

                let whitelist = guildObject?.whitelist?.autorole;
                if (whitelist) {
                  let found = false;
                  for (let k = 0; k < whitelist.length; k++) {
                    if (whitelist[k].id === membersWithoutRole[j].id) {
                      found = true;
                      break;
                    }
                  }
                  if (found) {
                    continue;
                  }
                }


                try {
                  await membersWithoutRole[j].roles.add(role.id);
                } catch (error) {
                  console.log(
                    error,
                    "error adding role to member in checkAutoroles function"
                  );
                }
              }
            }
          }
        }
      }
    }
  }

  async function onReady(client) {
  checkPermaBans(client)
    .catch((error) => {
      console.log(error, "Error in checkPermaBans");
    })
    .then(() => {
      // check to see if auto role is enabled for any roles, if so add the role to any members without the role
      checkAutoroles(client)
        .catch((error) => {
          console.log(error, "Error in checkAutoroles");
        })
        .then(() => {
          // Run checkPermaBans every 3 minutes
          setInterval(() => {
            checkPermaBans().catch((error) => {
              console.log(error, "Error in checkPermaBans");
            });
          }, 3 * 60 * 1000); // 3 minutes in milliseconds
        });
    });
}

module.exports = onReady;