const setCommandStyle = require("../../commands/Administration/setCommandStyle.js");

/**
 * Sets the command style to both slash commands and prefix commands for a server.
 *
 * @param {string} style - The desired command style (both).
 * @param {string} type - The type of command (prefix).
 * @param {Object} trigger - The interaction or message that triggered the command.
 * @param {string} prefix - The prefix for the server.
 */
async function activateSlashCommands(style, type, trigger, prefix) {

    // call setCommandStyle function
    await setCommandStyle(style, type, trigger, prefix);

}

module.exports = activateSlashCommands;
