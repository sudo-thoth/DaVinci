// All Functions Contained Within This File
/*
    logError,
    cLog,
    isDefined,
    verifyImport,
    installPackages,
    getImportStatement,
    generateColors,
    getRand,
    generateHexCode,
    chalkBox,
    inBox,
    getColor
*/

const fs = require("fs");
const chalk = require("chalk"); // npm i chalk@4.1.2
const execSync = require("child_process");
const box = require("cli-box");
const path = require("path");
const axios = require("axios-observable").Axios;


// Script Functions to be exported

/**
 * This module logs errors to the console, with the option to log additional data if it is provided.
 *
 * @param {Error} error - The error object to be logged.
 * @param {Object} [data] - Additional data to be logged with the error.
 */
function logError(error, data) {
  const errorMessage = new Error().stack;
  const errorLines = errorMessage.split("\n");
  const funcCallerLine = errorLines[2]; // "at createEmbed (/Users/thoth/Desktop/projects/bots/2test/src/djs/functions/create/createEmbed.js:79:11)"

  // Extract the file name, file path, line number, and column using the regular expression and array destructuring assignment as shown in the previous example

  let extractInfoRegex;
  let [fileName, filePath, lineNumber, column] = [];
  let fileNameWithExtension;
  try {
    extractInfoRegex = /at\s(.*)\s\((.*):(\d+):(\d+)\)/;
    [fileName, filePath, lineNumber, column] =
      funcCallerLine.match(extractInfoRegex);
    fileNameWithExtension = path.basename(filePath);
  } catch (err) {
    console.log(err);
    console.log(`ORIGINAL ERROR:`, error);
    console.log(`ORIGINAL DATA:`, data);
    return;
  }

  // Define two log messages
  let logWithData = `
  ${chalk.red.bold.bgGray("Error Details:")}
  ${"---------------"}
  ${chalk.bold.bgGray("Message:")} ${error.message}
  ${"---------------"}
  ${chalk.bold.blue.bgWhite("File:")} ${fileNameWithExtension}
  ${chalk.bold.cyan.bgWhite("Line:")} ${lineNumber}
  ${"---------------"}
  ${chalk.bold.yellow.bgGray("Data:")} ${JSON.stringify(data)}
  ${chalk.red(`Error Summary`)} ${error}
  `;

  let logWithoutData = `
  ${chalk.underline.red.bgGray("❌ Error Occurred ❌")}
  ${"---------------"}
  ${chalk.bold.bgGray("Message:")} ${error.message}
  ${"---------------"}
  ${chalk.bold.blue.bgWhite("File:")} ${fileNameWithExtension}
  ${chalk.bold.cyan.bgWhite("Line:")} ${lineNumber}
  `;

  // Check if the 'data' argument is defined
  if (data) {
        try {
          console.log(inBox(logWithData), error);
        } catch (err) {
          console.error(err);
        }
        return;
  } else {
    // If the 'data' argument is not defined, log the error message only
    try {
      console.log(inBox(logWithoutData), error);
    } catch (err) {
      console.error(err);
    }
    return;
  }
}

/**
 * Log the stacktrace and log data
 *
 * @param {string} stacktrace - The stacktrace data
 * @param {string} log - The log data
 *
 */
function logger(stacktrace, log) {

  const errorMessage = new Error().stack;
  const errorLines = errorMessage.split("\n");
  const funcCallerLine = errorLines[2]; // "at createEmbed (/Users/thoth/Desktop/projects/bots/2test/src/djs/functions/create/createEmbed.js:79:11)"

  // Extract the file name, file path, line number, and column using the regular expression and array destructuring assignment as shown in the previous example
  const extractInfoRegex = /at\s(.*)\s\((.*):(\d+):(\d+)\)/;
  const [, fileName, filePath, lineNumber, column] =
    funcCallerLine.match(extractInfoRegex);
  const fileNameWithExtension = path.basename(filePath);

  console.log(fileName);

  console.log(`fileNameWithExtension:`, fileNameWithExtension); // "createEmbed.js"
  console.log(`filename:`, fileName); // "createEmbed"
  console.log(`filePath:`, filePath); // "/Users/thoth/Desktop/projects/bots/2test/src/djs/functions/create/createEmbed.js"
  console.log(`lineNumber`, lineNumber); // "79"
  console.log(`column`, column); // "11"

  const logData = `
  ${chalk.bold.bgGray("Function/Error Called From:")} ${log}
  ${"---------------"}
  ${chalk.bold.blue.bgWhite("File:")} ${fileNameWithExtension}
  ${chalk.bold.cyan.bgWhite("Line:")} ${lineNumber}
  ${"---------------"}
  ${chalk.bold.yellow.bgGray("Data:")} ${JSON.stringify(data)}
  ${chalk.red(`Error Summary`)} ${error}
  `;
  console.log(logData);

  console.log(`end`);
}

/**
 * Logs data to the console with the file and line number where the function was called.
 * The data is also surrounded by a box.
 *
 * @param {any} data - The data to log.
 *
 * @example
 * consoleLog("Something went wrong");
 * // logs the data, the file and line number where the function was called, and surrounds the output with a box
 */
function cLog(data) {
  // Get the stack trace of the current error.
  // The stack trace is a string that contains information about the current call stack.
  // Each line of the stack trace represents a function call, with the most recent function call at the top.

  const errorMessage = new Error().stack;
  const errorLines = errorMessage.split("\n");
  const funcCallerLine = errorLines[2]; // "at createEmbed (/Users/thoth/Desktop/projects/bots/2test/src/djs/functions/create/createEmbed.js:79:11)"

  // Extract the file name, file path, line number, and column using the regular expression and array destructuring assignment as shown in the previous example

  const extractInfoRegex = /at\s(.*)\s\((.*):(\d+):(\d+)\)/;
  try {
    const [fileName, filePath, lineNumber, column] =
      funcCallerLine.match(extractInfoRegex);

    const fileNameWithExtension = path.basename(filePath);

    const lineLog = `${chalk.underline.italic.yellow.bgGray(
      " >>>>>> Log <<<<<< "
    )}`;

    let lineData;
    if (typeof data === "string") {
      lineData = `${chalk.yellow.bold.bgGray("Message:")}
    ${chalk.yellow.bgGray(data)}`;
    } else {
      lineData = `${chalk.yellow.bold.bgGray("Data:")}
    ${chalk.yellow.bgGray(data)}`;
    }
    const lineDivider = `${"---------------"}`;
    const logInfo = `
    ${chalk.underline.blue.bgGray("Location:")}
    ${chalk.bold.blue.bgWhite(`File: ${fileNameWithExtension}`)}
    ${chalk.bold.cyan.bgWhite(`Line: ${lineNumber}`)}`;

    // Create the log string using template literals and the chalk library to add formatting.
    // The log string includes the data being logged, as well as the file and line number where the consoleLog() function was called.
    // The data is displayed in yellow bold text, and the file and line number are displayed in blue and cyan bold text, respectively.
    // A horizontal line is also added to visually separate the data from the file and line number.
    const logs = data
      ? `
    ${lineLog}
    ${lineData}
    ${logInfo}
    
  `
      : `
  ${lineLog}
  ${logInfo}
  `;

    // Surround the log string with a box using the inBox() function and log the result to the console.
    try {
      console.log(inBox(logs), inBox(data));
    } catch (err) {
      console.log(`About to log an error`);
      logError(
        err,
        `Error in consoleLog() function. | Meaning an error when trying to do a regular logging.`
      );
    }
    return;
  } catch (error) {
    logError(error);
    console.log(`The Data ------> :`, data);
  }
}

/**
 * Returns a boolean indicating whether the given variable is defined
 *
 * @param {any} variable - The variable to check
 * @return {boolean} - True if the variable is defined, false otherwise
 */
function isDefined(variable) {
  let result = false;
  // add a check to make sure only one argument is passed in
  if (arguments.length !== 1) {
    try {
      throw new Error("isDefined() only accepts one argument");
    } catch (error) {
      logError(
        error,
        "isDefined() only accepts one argument, more than one argument was passed in"
      );
    }
  }
  if (
    variable !== null &&
    variable !== "null" &&
    variable !== undefined &&
    variable !== `undefined` &&
    variable !== "" &&
    variable !== 0 &&
    variable !== "0" &&
    variable !== false &&
    variable !== NaN &&
    variable !== Infinity &&
    variable !== -Infinity &&
    variable !== "Infinity" &&
    variable !== "-Infinity" &&
    variable !== "NaN" &&
    variable !== "-NaN" &&
    variable?.length !== 0 &&
    variable?.size !== 0
  )
    result = true;
  return result;
}

/**
 * Verify if the module is defined
 *
 * @param {Object} module - The module to verify if is defined
 *
 * @returns {boolean} A boolean indicating if the module is defined
 */
function verifyImport(module) {
  // check if the module is defined
  if (module !== undefined) {
    return true;
  } else {
    return false;
  }
}

/**
 * Installs a list of npm packages.
 *
 * @param {string[]} packageNames - An array of package names to be installed.
 *
 * @returns {void}
 *
 * @throws {Error} If an error occurs while executing the installPackages function.
 */

function installPackages(packageNames) {
  // Initialize a variable to keep track of the number of installed packages
  let numOfInstalledPackages = 0;
  // Use a try-catch block to handle any errors that may occur while executing the following code
  try {
    // Log a message to the console indicating that the installation process has started
    console.log(`In Progress of installing Packages . . . . .`);

    // Loop through the array of package names
    for (const packageName of packageNames) {
      // Use a try-catch block to handle any errors that may occur while installing a specific package
      try {
        // Use the execSync function to install the package using npm
        execSync(`npm install ${packageName}`, { stdio: "inherit" });
        // Increment the count of installed packages
        numOfInstalledPackages++;
      } catch (error) {
        // If the error has a code of "MODULE_NOT_FOUND", it means that the child_process package is not installed
        if (error.code === "MODULE_NOT_FOUND") {
          // Log a message to the console indicating that the child_process package must be installed
          console.log(
            `The 'child_process' package is not installed. Please install it by running 'npm install child_process' and try again.`
          );
        } else {
          // If the error is not a "MODULE_NOT_FOUND" error, it is assumed to be a different error, and the original error message is displayed
          console.error(`Failed to install ${packageName}.`);
        }
      }
    }
    // Log a message to the console indicating that the installation process has completed successfully
    console.log(
      `✅ Successfully Completed installPackages() installed ${numOfInstalledPackages} packages.`
    );
  } catch (error) {
    // If an error occurs outside of the inner try-catch block, it is assumed to be a different error, and the original error message is displayed
    console.error(`Error executing installPackages(): ${error.message}`);
  }
}

/**
 * Generates an array of unique hex codes.
 *
 * @param {number} num - The number of hex codes to generate. Must be a positive integer.
 * @returns {string[]} An array of hex codes.
 *
 * @throws {Error} If 'num' is not a positive integer.
 *
 * @example
 * generateColors(5); // returns an array of 5 unique hex codes
 */
function generateColors(num = 1) {
  if (typeof num !== "number" || num < 1 || num % 1 !== 0) {
    try {
      throw new Error("'num' must be a positive integer");
    } catch (error) {
      let about = "'num' must be a positive integer";
      logError(error, about);
    }
  }

  // an array to store the hex codes
  const colors = [];

  // generate 'num' hex codes
  let numOfColors;
  for (let colorsGenerated = 0; num > colorsGenerated; colorsGenerated++) {
    try {
      // generate a hex code
      const color = generateHexCode();
      // check if the hex code is already in the array and add it to the array if it's not
      if (!colors.includes(color)) {
        colors.push(color);
      } else {
        // if the hex code is already in the array, decrement the counter so we generate another hex code
        colorsGenerated--;
      }
    } catch (error) {
      // log the error and continue generating colors
      logError(error, "Error generating hex code");
      colorsGenerated--;
    }

    numOfColors = colorsGenerated;
    // exit the loop when the required number of colors have been generated
    if (colors.length === num) {
      break;
    }
  }
  // log the progress of the loop
  // cLog(`Generated ${numOfColors + 1} colors`);

  // return the array of hex codes
  return colors;
}

function getSuccessColor() {
  return `00ff00`;
}

function getErrorColor() {
  return [255, 0, 0];
}

/**
 * Generates an import statement for fileA relative to fileB.
 *
 * @param {string} fileA - The name of the file to be imported.
 * @param {string} fileB - The name of the file from which fileA will be imported.
 *
 * @returns {string} The import statement.
 */
function getImportStatement(fileA, fileB) {
  // Find the path to the src directory relative to the current file
  const pathToSrc = path.join(__dirname, "src");
  const pathToFileA = path.join(pathToSrc, `${fileA}.js`);
  const pathToFileB = path.join(pathToSrc, `${fileB}.js`);

  // Find the relative path from fileB to fileA
  const relativePath = path.relative(pathToFileB, pathToFileA);
  if (relativePath) {
    console.log(
      `The relative path from ${fileB} to ${fileA} is ${relativePath}`
    );
    // Return the import statement
    return relativePath.toString();
  } else {
    try {
      logError(
        error,
        `Error generating import statement from ${fileB} to ${fileA}`
      );
    } catch (error) {
      console.log(
        `The 'logError' file path is incorrect in getImportStatement.js`
      );
    }
  }
}

/**
 * Returns a random value/element from an array or object.
 *
 * @param {Array|Object} data - The array or object to select from.
 * @returns {any} A random element from the array or object.
 *
 * @throws {Error} If the passed variable is not an array or object.
 * @throws {Error} If the passed array is empty.
 * @throws {Error} If the passed variable is null or undefined.
 *
 * @example
 * getRand([1, 2, 3, 4, 5]); // returns a random element from the array
 * getRand({a: 1, b: 2, c: 3}); // returns a random value from the object
 */
function getRand(data = []) {
  try {
    // Check if the passed variable is null or undefined
    if (data == null) {
      throw new Error("Passed variable is null or undefined");
    }

    // Check if the passed variable is an array
    if (Array.isArray(data)) {
      // Check if the passed array is empty
      if (data.length === 0) {
        throw new Error("Passed array is empty");
      }

      // Generate a random number between 0 and the number of elements in the array
      const randIndex = Math.floor(Math.random() * data.length);

      // Return the element at the randomly-chosen index
      return data[randIndex];
    } else if (typeof data === "object" && data !== null) {
      // Get the keys of the object
      const keys = Object.keys(data);

      // Generate a random number between 0 and the number of keys in the object
      const randIndex = Math.floor(Math.random() * keys.length);

      // Return the value at the randomly-chosen key
      return data[keys[randIndex]];
    } else {
      throw new Error("Passed variable is not an array or object");
    }
  } catch (error) {
    // Log the error using the provided logError function
    try {
      logError(error);
    } catch (error) {
      console.error(error);
      return;
    }
  }
}

/**
 * Generates a random hex code for a color.
 *
 * @returns {string} - The generated hex code.
 *
 * @throws {Error} - If an error occurs while generating the hex code.
 *
 * @example
 * generateHexCode();
 * // returns a string such as "#ffaadd"
 */
function generateHexCode() {
  try {
    // generate a random number between 0 and 255 for each of the red, green, and blue channels
    const r = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0");
    const g = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0");
    const b = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0");

    // return the hex code as a string
    return `#${r}${g}${b}`;
  } catch (error) {
    // if an error occurs, catch it and throw it again so that it can be handled by the caller
    logError(error, "Error generating hex code");
  }
}

/**
 * Create a text box with chalk
 *
 * @param {string} text - The text to put in the box
 *
 * @returns {string} A string of the text in a box, with horizontal lines made of the text length / 2
 *
 */
function chalkBox(text) {
  const horizontalLine = "-".repeat(text.length / 2);
  let boxed = `
    ${chalk.bgGray.bold(horizontalLine)}
    ${` ${text} `}
      ${chalk.bgGray.bold(horizontalLine)}
      `;
  return boxed;
}

/**
 * Creates a box around a given string with specified options.
 *
 * @param {string} text - The text to be surrounded by a box.
 * @param {string} [color='yellow'] - The color of the border.
 * @returns {string} - The text surrounded by a box.
 *
 * @example
 * inBox("Hello, World!", "red");
 * // returns the text "Hello, World!" surrounded by a red box
 */
function inBox(text, color = "yellow") {
  // check color is a string and if not set to yellow
  if (typeof color !== "string") {
    color = "yellow";
  }

  // check text is a string and if not, return an error message
  if (typeof text !== "string") {
    return text;
  }

  try {
    return chalkBox(text);
  } catch (error) {
    console.log(
      "Error Attempting to use the chalkBox function : in the process of creating a box around a string to be logged to the console"
    );
    return;
  }
}

/**
 * A cache of unique hex codes.
 *
 * @type {Set}
 * The colorCache object is a Set that stores a set of unique hex codes.
 */
const colorCache = new Set();

/**
 * Returns a random color from a set of unique hex codes.
 *
 * @returns {string} A random hex code.
 *
 * @throws {Error} If there are no more unique hex codes in the cache.
 *
 * @example
 * getColor(); // returns a random hex code
 */
function getColor() {
  try {
    // The generateColors() function generates an array of unique hex codes.
    // The getRand() function returns a random element from an array.
    // If the colorCache is empty, a new set of unique hex codes is generated and added to the cache.
    if (colorCache.size === 0) {
      const colors = generateColors(100);
      for (const color of colors) {
        colorCache.add(color);
      }
    }

    // Choose a random color from the cache and remove it from the cache using the delete() method.
    const color = getRand([...colorCache]);
    colorCache.delete(color);

    // Return the selected color.
    return color;
  } catch (error) {
    // The try block attempts to get a random color from the cache and remove it from the cache.
    // If an error occurs, it is caught in the catch block and a new error is thrown with a more descriptive message.
    logError(error, "Failed to get a random color");
    return "#040303";
  }
}

/**
 * Check if the input string matches the curse word pattern
 *
 * @param {string} input - The input string to check for curse words
 *
 * @returns {boolean} A boolean value indicating whether the input string matches the curse word pattern.
 *
 */
function checkForCurseWords(input) {
  // Regular expression pattern for matching curse words and variations
  const curseWordPattern =
    /d(?:a|e)mn|retard|hell|d(?:a|e)rn|frick|freaking|tit|gosh|heck|asshole|nuts|dick|vagina|fu(?:k|x|ck|uk|uck|uc|c)|pussy|sh(?:oo|i)t|ni(?:ga|ger|gga|gger|g)|ass|boob/i;

  // Check if the input string matches the curse word pattern
  return curseWordPattern.test(input);
}


const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// This function extracts the domain name from a URL string.

function getDomain(url) {
  try {
    new URL(url);
  } catch (err) {
    console.error(`Invalid URL: ${url}`);
    return;
  }
  
  // Extract the domain name
  const domainName = new URL(url).hostname;
  return domainName;
}
/**
 * Schedule a function to run after a specified delay.
 * @param {Function} func - The function to be scheduled.
 * @param {number} delay - The delay, in milliseconds, before the function is called.
 * @param {...any} args - Optional additional arguments to pass to the function.
 * @returns {Promise} A promise that resolves after the specified delay and executes the function.
 * @example 
 * // Define the function to be scheduled
 * const greetUser = (name) => {
 *   console.log(`Hello, ${name}!`);
 * };
 *
 * // Schedule the function to run after a delay of 3 seconds
 * scheduleFunction(greetUser, 3000, "John");
 *
 * // Output: After 3 seconds: Hello, John!
 */
// This function will execute another function after a specified delay.

const scheduleFunction = async (func, delay, ...args) => {
  // If we don't have a function or delay, throw an error.
  if (typeof func !== 'function' || typeof delay !== 'number') {
    throw new Error('Invalid arguments');
  }
  
  // If there are additional arguments, use them when calling the function.
  if (args.length > 0) {
    func(...args);
  }
  
  // Wait for the specified delay using a promise and setTimeout.
  await new Promise(resolve => setTimeout(resolve, delay));
};

// This function shortens a string to a maximum length.
// It takes a string and a maximum length as input.
// It returns a string that is no longer than the maximum length.

const capLength = (chars, max) => {
  let text = chars;
  if (text?.length > max) {
    text = text.slice(0, (max-3)) + "...";
  }
  return text;
};


module.exports = {
  capLength,
  scheduleFunction,
  getDomain,
  logError,
  cLog,
  isDefined,
  verifyImport,
  installPackages,
  getImportStatement,
  generateColors,
  getRand,
  generateHexCode,
  chalkBox,
  inBox,
  getColor,
  logger,
  getSuccessColor,
  getErrorColor,
  checkForCurseWords,
  delay,
};
