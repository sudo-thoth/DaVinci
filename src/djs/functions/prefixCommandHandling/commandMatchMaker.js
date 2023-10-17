const client = require("../../index.js");

/**
 * Finds a command in the client.commands Collection that matches the given command name.
 * @param {string} commandName - The name of the command to match.
 * @returns {(object|boolean)} - The command object if a match is found, or false if no match is found.
 */
function commandMatchMaker(commandName) {
  // go through each command in the client.commands Collection
  for (const command of client.commands) {
    const sudo_names = command[1].sudo;
    // first put every sudo name into all lower case as well as the commandName string variable
    const commandNames = sudo_names?.map((name) => name.toLowerCase());
    commandName = commandName.toLowerCase();
    // check if the commandName string variable is in the sudo array
    if (commandNames.length > 0) {
      if (commandNames.includes(commandName)) {
        // if so return the command
        return command[1];
      }
    }
  }
  // if the commandName string variable is not in the sudo array, return false
  return false;
}

module.exports = commandMatchMaker;
