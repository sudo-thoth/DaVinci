const djsEmojis = require("../../scripts/djsEmojis.js");
const client = require("./../../../index.js");
const createEmbed = require("./../../create/createEmbed.js");
const scripts_djs = require("./../../scripts/scripts_djs.js");


// function to add a user to the permanent ban list in the database and local dbs

/**
 * Performs a permanent ban action on a target user.
 * @param {Object} options - The options for the permaBan action.
 * @param {string|Object} options.target - The target user ID or user object.
 * @param {string} options.trigger - The trigger message or interaction ID.
 * @param {string} [options.triggerType="interaction"] - The type of trigger ("interaction" or "message").
 * @param {string} options.reason - The reason for the ban.
 * @param {string} options.action - The action to perform ("add", "remove", or "view").
 * @param {boolean} [options.deferred=true] - Whether to defer the response or not.
 * @param {boolean} [options.failed=false] - Whether the action failed or not.
 * @returns {Object|Array} - The result of the permaBan action.
 */
async function permaBan({target, trigger, triggerType = "interaction", reason, action, deferred = true, failed = false}) {
  // respond to the trigger with a status message
  // return true if complete
  // return If FAILED return false and the reason why failed as a string { status: false, reason: "reason" }


  let targetID = typeof target !== "string" ? target?.id : target;
  // pull the guildObject from the local db or mongodb if not local
  try {
    let guild = trigger?.guild;
  
    guild = await client.guilds.fetch(guild?.id);
  
    let guildObject;
    guildObject = client?.localDB[`${guild.name}`]?.guildObject || await client.getServer(guild);
  
    if(!guildObject){
      guildObject = await client.setupServer(guild)
    }
  } catch (error) {
    // respond to the trigger with an error message
    console.log(error, `Error occurred while getting the guildObject`);
    let errEmbed = createEmbed({
      title: `${djsEmojis.crossmark} **Unable to Run PermaBan**`,
      description: `> \`Permaban action: ${action}\`\n> I was unable to ${action} <@${targetID}> for some reason.\n> \`\`\`js\n${error}\n\`\`\``,
      color: scripts.getErrorColor(),
    });

    try{
      let r = await scripts_djs.send({ // send the error embed via the send function
        trigger,
        triggerType: scripts_djs.getTriggerType(failed),
        triggerUser: trigger?.user,
        messageObject: {embeds: [errEmbed]},
        deferred,
        failed
      })
      failed = r?.failed || failed;
      deferred = failed ? false : deferred;
      trigger = r?.trigger || trigger;
      
    } catch (error) {
      console.log(error, `Failed Negative PermaBan Edit Attempt`);
    }
    return {status: false, reason:`error occurred while getting the guildObject\`\`\`js\n${error}\`\`\``, trigger}; // return false if failed
    
  }
    // get the permanent bans array
    let permanentBans = guildObject?.permanentBans;
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
    if (found_whitelist) { // if the member is on the whitelist, then return false
      console.log(`PermaBan Request Denied: ❌`);

      // respond to the trigger with an error message
      let errEmbed = createEmbed({
        title: `${djsEmojis.crossmark} **Unable to Run PermaBan**`,
        description: `> \`Permaban action: ${action}\`\n> Was UNABLE to add <@${targetID}> to the \`Permanent Ban List\` at this time.\n> \n> <@${targetID}> is on the \`PermaBan Whitelist\``,
        color: scripts.getErrorColor(),
      });

      
        try {
          let r = await scripts_djs.send({ // send the error embed via the send function
            trigger,
            triggerType,
            triggerUser: trigger?.user,
            messageObject: {embeds: [errEmbed]},
            deferred,
            failed
          })
          failed = r?.failed || failed;
      deferred = failed ? false : deferred;
      trigger = r?.trigger || trigger;
        } catch (error) {
          console.log(error, `Failed Negative PermaBan Edit Attempt`);
        }
        return {status: false, reason:`<@${targetID}> is on the \`PermaBan Whitelist\``, trigger}; // return false if failed
    }

  // search the Permaban array for the user id
  for(let i = 0; i < permanentBans?.length; i++){
    let perma = permanentBans[i]
let permaDoc = perma._doc
    if(permaDoc.user.id === targetID){
      found_permaBan = true;
      break;
    }
  }

  // if the user was not found, add them to the array
  if(!found_permaBan){
    // Calculate timestamp in EST
const estTimestamp = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });

    permanentBans.push({reason: reason, user: {id: targetID, username: typeof target !== "string" ? target?.username : (target || null), bot: typeof target !== "string" ? target?.bot : null, timestamp: {text: estTimestamp, value: Date.now()}}})
  } else { // if the user was found_permaBan, then return false
    
    // send a reply to the trigger
    try {
      let errEmbed = createEmbed({
        title: `${djsEmojis.crossmark} **Unable to Run PermaBan**`,
        description: `> \`Permaban action: ${action}\`\n> ${djsEmojis.checkmark} The User is **already** on the PermaBan List & therefore cannot be added again`,
        color: scripts.getErrorColor(),
      });

        let r = await scripts_djs.send({ // send the error embed via the send function  
          trigger,
          triggerType,
          triggerUser: trigger?.user,
          messageObject: {embeds: [errEmbed]},
          deferred,
          failed
        })
        failed = r?.failed || failed;
      deferred = failed ? false : deferred;
      trigger = r?.trigger || trigger;
    } catch (error) {
      console.log(error, `Failed Negative PermaBan Message Attempt`);
    }

    return {status: false, reason:`${djsEmojis.checkmark} The User is **already** on the PermaBan List & therefore cannot be added again`, trigger} // return false if failed
  }
  // update the database with the new permanent ban array
  guildObject.permanentBans = permanentBans
  client.localGuilds.set(interaction.guild.id, guildObject);
  client.localDB[`${guild.name}`].guildObject = guildObject;
  try {
    await client.guildsDB.findOneAndUpdate(
      { serverID: interaction.guild.id },
      { $set: { permanentBans: permanentBans } }
    );
  } catch (error) {
    // respond to the trigger with an error message
    try {
      // create error embed
      let errEmbed = createEmbed({  
        title: `${djsEmojis.crossmark} **Unable to Run PermaBan**`,
        description: `> \`Permaban action: ${action}\`\n> I was unable to add <@${targetID}> to the \`Permanent Ban List\` at this time.\n> \`\`\`js\n${error}\n\`\`\``,
        color: scripts.getErrorColor(),
      });
        let r = await scripts_djs.send({ // send the error embed via the send function
          trigger,
          triggerType,
          triggerUser: trigger?.user,
          messageObject: {embeds: [errEmbed]},
          deferred,
          failed
        })
        
        failed = r?.failed || failed;
        deferred = failed ? false : deferred;
        trigger = r?.trigger || trigger;

    } catch (error) {
      console.log(error, `Failed Negative PermaBan Message Attempt`);
      return {status: false, reason:`error sending update message to the trigger\`\`\`js\n${error}\`\`\``, trigger}
    }


    return {status: false, reason:`error occurred while updating the database about permaBan status\`\`\`js\n${error}\`\`\``, trigger}
  }

// handle the success message in the function that called this function

  return {status: true, reason:`${djsEmojis.checkmark} Successfully added <@${targetID}> to the \`Permanent Ban List\``, trigger}

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

  // if the user was found, remove them from the array
  if(found_permaBan){
    if(permanentBans?.length > 0){
      permanentBans = permanentBans.filter((ban) => ban?.id !== targetID);
    }
  } else {
    return {status: false, reason:`${djsEmojis.checkmark} The User is **not** on the PermaBan List & therefore cannot be removed`, trigger} // return false if failed
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
        // respond to the trigger with an error message
        try {
          // create error embed
          let errEmbed = createEmbed({  
            title: `${djsEmojis.crossmark} **Unable to Run PermaBan**`,
            description: `> \`Permaban action: ${action}\`\n> I was unable to remove <@${targetID}> from the \`Permanent Ban List\` at this time.\n> \`\`\`js\n${error}\n\`\`\``,
            color: scripts.getErrorColor(),
          });

            let r = await scripts_djs.send({ // send the error embed via the send function
              trigger,
              triggerType,
              triggerUser: trigger?.user,
              messageObject: {embeds: [errEmbed]},
              deferred,
              failed
            })
            
            failed = r?.failed || failed;
            deferred = failed ? false : deferred;
            trigger = r?.trigger || trigger;
    
        } catch (error) {
          console.log(error, `Failed Negative PermaBan Message Attempt`);
          return {status: false, reason:`error sending update message to the trigger\`\`\`js\n${error}\`\`\``, trigger}
        }

    return {status: false, reason:`error occurred while updating the database about permaBan status\`\`\`js\n${error}\`\`\``, trigger} // return false if failed

  }

  // handle the success message in the function that called this function

  return {status: true, reason:`${djsEmojis.checkmark} Successfully removed <@${targetID}> from the \`Permanent Ban List\``, trigger} // return true if complete

} else if (action === "view"){
  return permanentBans; // return the array if view
}
}


module.exports = permaBan;