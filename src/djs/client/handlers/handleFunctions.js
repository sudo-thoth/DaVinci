const fs = require('fs');

module.exports = function handleFunctions(functionFolders, path) {
        functionsArray = [];
        // Loop through the folders in the functions directory
        for (folder of functionFolders) {
            // Get the files in the folder
            const functionFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            // Loop through the files in the folder
            for (const file of functionFiles) {
                // Require the file and push it to the functions array
                const functionFile = require(`../../functions/${folder}/${file}`);
                functionsArray.push(functionFile.toString());

            }

        }
        console.log(`Handle Functions: ✅`)
        return functionsArray; // Return the functions array
};