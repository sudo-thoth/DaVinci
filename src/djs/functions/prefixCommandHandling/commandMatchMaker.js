    const client = require('../../index.js');
    // so in client there is a client.commands Collection that has all the commands in it, ex: client.commands.set(command.data.name, command);
    // within each command object there is a sudo property that is an array of strings that are the names of the command
    // I want to go through each command in the client.commands Collection and check if the commandName string variable is in the sudo array
    // if so return the command

function commandMatchMaker(commandName) {
        // go through each command in the client.commands Collection
        for (const command of client.commands) {
            const sudo_names = command[1].sudo;
            // first put every sudo name into all lower case as well as the commandName string variable
            const commandNames = sudo_names.map(name => name.toLowerCase());
            commandName = commandName.toLowerCase();
            // check if the commandName string variable is in the sudo array
            if (commandNames.includes(commandName)) {
                // if so return the command
                return command[1];
            }
        }
        // if the commandName string variable is not in the sudo array, return false
        return false;
    }

    module.exports = commandMatchMaker;