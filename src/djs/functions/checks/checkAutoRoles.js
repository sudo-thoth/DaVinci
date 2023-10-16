/**
 * Checks for autoroles in all servers the bot is in and adds the role to any member that does not have it.
 *
 * @param {Object} client - The Discord client object.
 */
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

module.exports = checkAutoroles;