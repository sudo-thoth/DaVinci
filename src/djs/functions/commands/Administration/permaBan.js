const djsEmojis = require("../../scripts/djsEmojis.js");
const client = require("./../../../index.js");
const createEmbed = require("../embeds/createEmbed.js");


// function to add a user to the permanent ban list in the database and local dbs

async function permaBan(target, trigger, reason, action) {
  // respond to the trigger with a status message
  // return true if complete
  // return If FAILED return false and the reason why failed as a string { status: false, reason: "reason" }

  let backupReply = trigger;
  let failed = false;

  let targetID = typeof target !== "string" ? target?.id : target;
  // pull the guildObject from the local db or mongo db if not local
  try {
    let guild = trigger?.guild;
  
    guild = await client.guilds.fetch(guild?.id);
  
    let guildObject;
    guildObject = client.localDB[`${guild.name}`]?.guildObject || await client.getServer(guild);
  
    if(!guildObject){
      guildObject = await client.setupServer(guild)
    }
  } catch (error) {
    // respond to the trigger with an error message
    console.log(error, `Error occurred while getting the guildObject`);
    failed = true;
    let errEmbed = createEmbed({
      title: `Unable to Run PermaBan`,
      description: `❌ \`type: ${action}\`\nI was unable to ${action} <@${targetID}> for some reason.\n\`\`\`js\n${error}\n\`\`\``,
      color: scripts.getErrorColor(),
    });

    try{
      await trigger.editReply({ embeds: [errEmbed] });
    } catch (error) {
      console.log(error, `Failed Negative PermaBan Edit Attempt`);

      // if error send a message to the channel
      try {
        backupReply = await trigger.channel.send({ embeds: [errEmbed] });
      } catch (error) {
        console.log(error, `Failed Negative PermaBan Message Attempt`);
      }
    }
    return {status: false, reason:`error occurred while getting the guildObject\`\`\`js\n${error}\`\`\``, trigger: backupReply};
    
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

      // respond to the trigger with an error message
      let errEmbed = createEmbed({
        title: `Unable to Run PermaBan`,
        description: `❌ \`type: ${action}\`\nWas UNABLE to add <@${targetID}> to the \`Permanent Ban List\` at this time.\n\n<@${targetID}> is on the \`PermaBan Whitelist\``,
        color: scripts.getErrorColor(),
      });

      
        if(failed){
          try {
            await backupReply.edit({ embeds: [errEmbed] });
          } catch (error) {
            console.log(error, `Failed Negative PermaBan Edit Attempt`);
            failed = true;
            // if error send a message to the channel
            try {
              backupReply = await trigger.channel.send({ embeds: [errEmbed] });
            } catch (error) {
              console.log(error, `Failed Negative PermaBan Message Attempt`);
            }
            
          }
        } else {
          try {
            await trigger.editReply({ embeds: [errEmbed] });
          } catch (error) {
            console.log(error, `Failed Negative PermaBan Edit Attempt`);
            failed = true;
            // if error send a message to the channel
            try {
              backupReply = await trigger.channel.send({ embeds: [errEmbed] });
            } catch (error) {
              console.log(error, `Failed Negative PermaBan Message Attempt`);
            }
            
          }
        }

        return {status: false, reason:`<@${targetID}> is on the \`PermaBan Whitelist\``, trigger: backupReply};
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
    // send a reply to the trigger

    try {
      let errEmbed = createEmbed({
        title: `Unable to Run PermaBan`,
        description: `❌ \`type: ${action}\`\n${djsEmojis.checkmark} The User is **already** on the PermaBan List & therefore cannot be added again`,
        color: scripts.getErrorColor(),
      });

      if(failed){
        try {
          await backupReply.edit({ embeds: [errEmbed] });
        } catch (error) {
          console.log(error, `Failed Negative PermaBan Edit Attempt`);
          failed = true;
          // if error send a message to the channel
          try {
            backupReply = await trigger.channel.send({ embeds: [errEmbed] });
          } catch (error) {
            console.log(error, `Failed Negative PermaBan Message Attempt`);
          }
          
        }
      } else {
        try {
          await trigger.editReply({ embeds: [errEmbed] });
        } catch (error) {
          console.log(error, `Failed Negative PermaBan Edit Attempt`);
          failed = true;
          // if error send a message to the channel
          try {
            backupReply = await trigger.channel.send({ embeds: [errEmbed] });
          } catch (error) {
            console.log(error, `Failed Negative PermaBan Message Attempt`);
          }
          
        }
      }
    } catch (error) {
      console.log(error, `Failed Negative PermaBan Message Attempt`);
    }

    return {status: false, reason:`${djsEmojis.checkmark} The User is **already** on the PermaBan List & therefore cannot be added again`, trigger: backupReply}
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

    // send a reply to the trigger

    try {

      let errEmbed = createEmbed({  
        title: `Unable to Run PermaBan`,
        description: `❌ \`type: ${action}\`\nI was unable to add <@${targetID}> to the \`Permanent Ban List\` at this time.\n\`\`\`js\n${error}\n\`\`\``,
        color: scripts.getErrorColor(),
      });

      if(failed){
        try {
          await backupReply.edit({ embeds: [errEmbed] });
        } catch (error) {
          console.log(error, `Failed Negative PermaBan Edit Attempt`);
          failed = true;
          // if error send a message to the channel
          try {
            backupReply = await trigger.channel.send({ embeds: [errEmbed] });
          } catch (error) {
            console.log(error, `Failed Negative PermaBan Message Attempt`);
          }
          
        }
      } else {
        try {
          await trigger.editReply({ embeds: [errEmbed] });
        } catch (error) {
          console.log(error, `Failed Negative PermaBan Edit Attempt`);
          failed = true;
          // if error send a message to the channel
          try {
            backupReply = await trigger.channel.send({ embeds: [errEmbed] });
          } catch (error) {
            console.log(error, `Failed Negative PermaBan Message Attempt`);
          }
          
        }
      }

    } catch (error) {
      console.log(error, `Failed Negative PermaBan Message Attempt`);
      return {status: false, reason:`error sending update message to the trigger\`\`\`js\n${error}\`\`\``, trigger: backupReply}
    }


    return {status: false, reason:`error occurred while updating the database about permaBan status\`\`\`js\n${error}\`\`\``, trigger: backupReply}
  }

  // send a reply to the trigger

  return {status: true, reason:`${djsEmojis.checkmark} Successfully added <@${targetID}> to the \`Permanent Ban List\``, trigger: backupReply}

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
    return {status: false, reason:`${djsEmojis.checkmark} The User is **not** on the PermaBan List & therefore cannot be removed`}
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
    return {status: false, reason:`error occurred while updating the database about permaBan status\`\`\`js\n${error}\`\`\``}
  }

  return {status: true, reason:`${djsEmojis.checkmark} Successfully removed <@${targetID}> from the \`Permanent Ban List\``}

} else if (action === "view"){
  return permanentBans;
}
}


module.exports = permaBan;