const djsEmojis = require("../../scripts/djsEmojis.js");
const client = require("../../../index.js");


// function to add a user to the permanent ban list in the database and local dbs

async function permaBan(target, trigger, reason, action) {
  // return true if complete
  // return If FAILED return the reason why failed

  let targetID = typeof target !== "string" ? target?.id : target;
  // pull the guildObject from the local db or mongo db if not local
  let guild = trigger?.guild;
  //TODO: potentially fetch the guild djs object if needed

  let guildObject;
  guildObject = client.localDB[`${guild.name}`]?.guildObject || await client.getServer(guild);

  if(!guildObject){
    guildObject = await client.setupServer(guild)
  }
    // get the permanent bans array
    let permanentBans = guildObject?.permanentBans
    let found_permaBan = false;

  if(action === "add"){
    let found_whitelist = false;

    // check to make sure the member is not on the permaban whitelist
    let whitelist = guildObject?.whitelist?.permaBan;
      // check if the whitelist is not empty
      if(whitelist?.length > 0){
        // check if the member is on the whitelist
        for(let i = 0; i < whitelist.length; i++){
          let white = whitelist[i]
          if(white.id === targetID){
            found_whitelist = true;
            break;
          }
        }
    }
    if (found_whitelist) {
      console.log(`PermaBan Request Denied: ❌`);
      // return status saying user is whitelisted from permaban
      return `Was UNABLE to add <@${targetID}> to the \`Permanent Ban List\` at this time.\n\n<@${targetID}> is on the \`PermaBan Whitelist\``;
    }

  // search the array for the user id
  for(let i = 0; i < permanentBans?.length; i++){
    let perma = permanentBans[i]
let permaDoc = perma._doc
    if(permaDoc.user.id === targetID){
      found_permaBan = true;
      break;
    }
  }

  // if the user was not found_permaBan, add them to the array
  if(!found_permaBan){
    permanentBans.push({reason: reason, user: {id: targetID, username: typeof target !== "string" ? target?.username : null, bot: typeof target !== "string" ? target?.bot : null}})
  } else {
    return `${djsEmojis.checkmark} The User is **already** on the PermaBan List & therefore cannot be added again`
  }
  // update the database
  guildObject.permanentBans = permanentBans
  client.localGuilds.set(interaction.guild.id, guildObject);
  client.localDB[`${guild.name}`].guildObject = guildObject;
  try {
    await client.guildsDB.findOneAndUpdate(
      { serverID: interaction.guild.id },
      { $set: { permanentBans: permanentBans } }
    );
  } catch (error) {
    return`error occurred while updating the database about permaBan status\`\`\`js\n${error}\`\`\``
  }
} else if(action === "remove") {
  // search the array for the user id

  for(let i = 0; i < permanentBans?.length; i++){
    let perma = permanentBans[i]
let permaDoc = perma._doc
    if(permaDoc.user.id === targetID){
      found_permaBan = true;
      break;
    }
  }

  // if the user was found_permaBan, remove them from the array
  if(found_permaBan){
    if(permanentBans?.length > 0){
      permanentBans = permanentBans.filter((ban) => ban?.id !== targetID);

    }
  } else {
    return `${djsEmojis.checkmark} The User is **not** on the PermaBan List & therefore cannot be removed`
  }
  // update the database
  guildObject.permanentBans = permanentBans
  client.localGuilds.set(interaction.guild.id, guildObject);
  client.localDB[`${guild.name}`].guildObject = guildObject;
  try {
    await client.guildsDB.findOneAndUpdate(
      { serverID: interaction.guild.id },
      { $set: { permanentBans: permanentBans } }
    );
  } catch (error) {
    return`error occurred while updating the database about permaBan status\`\`\`js\n${error}\`\`\``
  }

} else if (action === "view"){
  return permanentBans;
}
}


module.exports = permaBan;