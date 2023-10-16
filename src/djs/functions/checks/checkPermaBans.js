/**
 * Checks for permanent bans in all servers the bot is in and kicks and bans the user if found.
 *
 * @param {Object} client - The Discord client object.
 */
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
                            "error kicking member in checkPermaBans function in checkPermaBans.js"
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
                            "error banning member in checkPermaBans function in checkPermaBans.js"
                        );
                    }
                    break;
                }
            }
        }
    }
}

module.exports = checkPermaBans;