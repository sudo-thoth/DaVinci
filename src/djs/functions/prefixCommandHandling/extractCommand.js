/**
 * Extracts the command name and arguments from a message text that starts with a given prefix.
 * @param {string} prefix - The prefix used to identify the command.
 * @param {string} text - The message text that contains the command and its arguments.
 * @returns {Object} An object containing the command name and arguments.
 */
function extractCommand(prefix, text) {
  // separate the text from the prefix
  let commandSentence = text.slice(prefix.length);
  // separate the command name from the arguments
  let commandName = commandSentence.split(" ")[0];
  // separate the arguments from the command name
  let args = commandSentence.slice(commandName.length + 1);
  // separate the arguments into an array
  args = args.split(" ");
  // remove any args that are empty
  args = args.filter((arg) => arg !== "");
  // return the command name and arguments as an object
  return { commandName, args };
}

module.exports = extractCommand;
