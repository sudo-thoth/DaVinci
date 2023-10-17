// a function that seperates the text into the command name and arguments, passed in with be the prefix string and the message text
// the function must return an object with the command name and arguments as an array
function extractCommand(prefix, text) {
    // seperate the text from the prefix 
    let commandSentence = text.slice(prefix.length);
    // seperate the command name from the arguments
    let commandName = commandSentence.split(" ")[0];
    // seperate the arguments from the command name
    let args = commandSentence.slice(commandName.length + 1);
    // seperate the arguments into an array
    args = args.split(" ");
    // return the command name and arguments as an object
    return { commandName, args };
    
}

module.exports = extractCommand;