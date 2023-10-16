const chalk = require("chalk"); // npm i chalk@4.1.2
const execSync = require("child_process");
const box = require("cli-box");
const path = require("path");

/**
 * Function to log errors with additional data (if provided).
 *
 * @param {Error} error - The error to be logged.
 * @param {any} data - Additional data to be logged.
 */
function logError(error, data) {
  const errorMessage = new Error().stack;
  const errorLines = errorMessage.split("\n");
  const funcCallerLine = errorLines[2];

  let extractInfoRegex;
  let [fileName, filePath, lineNumber, column] = [];

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

  if (data) {
    try {
      console.log(inBox(logWithData), error);
    } catch (err) {
      console.error(err);
    }
    return;
  } else {
    try {
      console.log(inBox(logWithoutData), error);
    } catch (err) {
      console.error(err);
    }
    return;
  }
}

/**
 * Function to log data to console with file and line number.
 *
 * @param {string} stacktrace - The stack trace.
 * @param {string} log - The log message.
 */
function logger(stacktrace, log) {
  const errorMessage = new Error().stack;
  const errorLines = errorMessage.split("\n");
  const funcCallerLine = errorLines[2];

  const extractInfoRegex = /at\s(.*)\s\((.*):(\d+):(\d+)\)/;
  const [, fileName, filePath, lineNumber, column] =
    funcCallerLine.match(extractInfoRegex);
  const fileNameWithExtension = path.basename(filePath);

  console.log(fileName);

  console.log(`fileNameWithExtension:`, fileNameWithExtension);
  console.log(`filename:`, fileName);
  console.log(`filePath:`, filePath);
  console.log(`lineNumber`, lineNumber);
  console.log(`column`, column);

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
 * Function to log data with formatting.
 *
 * @param {any} data - The data to be logged.
 */
function cLog(data) {
  const errorMessage = new Error().stack;
  const errorLines = errorMessage.split("\n");
  const funcCallerLine = errorLines[2];

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
 * Function to check if a variable is defined.
 *
 * @param {any} variable - The variable to check for definedness.
 * @returns {boolean} True if the variable is defined, otherwise false.
 */
function isDefined(variable) {
  let result = false;
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
    variable !== "NaN"
  ) {
    result = true;
  }
  return result;
}

/**
 * Function to verify if a module is defined.
 *
 * @param {string} module - The name of the module to verify.
 * @returns {string} A message indicating if the module is loaded and defined.
 */
function verifyImport(module) {
  let result;
  if (isDefined(module)) {
    result = `The ${module} module is loaded and defined`;
    try {
      cLog(result);
      return result;
    } catch (err) {
      logError(
        err,
        `Error while verifying if the ${module} module is loaded and defined.`
      );
    }
  }
}

/**
 * Function to install npm packages.
 *
 * @param {string|string[]} packageNames - The name or names of npm packages to install.
 * @returns {string[]} An array of results for each package installation.
 */
function installPackages(packageNames) {
  if (packageNames.constructor === String) {
    packageNames = packageNames.split(" ");
  }
  let results = [];
  for (let i = 0; i < packageNames.length; i++) {
    try {
      execSync(`npm install ${packageNames[i]}`, (error, stdout, stderr) => {
        if (error) {
          results.push(
            `ERROR: Failed to install ${packageNames[i]}. Please check your internet connection and try again.`
          );
        } else {
          results.push(`Successfully installed ${packageNames[i]} package.`);
        }
      });
    } catch (error) {
      logError(
        error,
        `Error while installing npm packages in installPackages() function.`
      );
    }
  }
  return results;
}

/**
 * Function to generate unique hex codes.
 *
 * @param {number} num - The number of hex codes to generate (default is 1).
 * @returns {string[]} An array of generated hex codes.
 */
function generateColors(num = 1) {
  let colors = [];
  let letters = "0123456789ABCDEF";
  for (let j = 0; j < num; j++) {
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    colors.push(color);
  }
  return colors;
}

/**
 * Function to get a success color.
 *
 * @returns {string} The success color code.
 */
function getSuccessColor() {
  return "#4BB543";
}

/**
 * Function to get an error color.
 *
 * @returns {string} The error color code.
 */
function getErrorColor() {
  return "#FF6B6B";
}

/**
 * Function to generate an import statement.
 *
 * @param {string} fileA - The variable name.
 * @param {string} fileB - The module path.
 * @returns {string} The generated import statement.
 */
function getImportStatement(fileA, fileB) {
  let result;
  if (isDefined(fileA) && isDefined(fileB)) {
    try {
      result = `const ${fileA} = require("${fileB}");`;
      return result;
    } catch (error) {
      logError(
        error,
        `Error while generating an import statement in getImportStatement() function.`
      );
    }
  }
}

/**
 * Function to get a random value from an array or object.
 *
 * @param {Array|Object} data - The data to get a random value from.
 * @returns {any} A random value from the input data.
 */
function getRand(data = []) {
  let result;
  if (data.constructor === Object) {
    data = Object.values(data);
  }
  try {
    result = data[Math.floor(Math.random() * data.length)];
    return result;
  } catch (error) {
    logError(
      error,
      `Error while getting a random value from an array or object in getRand() function.`
    );
  }
}

/**
 * Generates a random hex code for a color.
 *
 * @returns {string} The generated hex code.
 */
function generateHexCode() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

/**
 * Function to create a text box with chalk.
 *
 * @param {string} text - The text to display in the box.
 */
function chalkBox(text) {
  let box = require("cli-box");
  let colors = [
    "black",
    "red",
    "green",
    "yellow",
    "blue",
    "magenta",
    "cyan",
    "white",
  ];
  let i = 0;
  let colorIndex = 0;

  function randomColor() {
    return colors[(colorIndex = (colorIndex + 1) % colors.length)];
  }
  const b = box({
    h: 7,
    w: 30,
    float: "center",
    lines: [{ text: `${text}`, vAlign: "middle", hAlign: "center" }],
    marks: {
      ul: " ",
      ur: " ",
      bl: " ",
      br: " ",
      h: " ",
      v: " ",
    },
  });

  const bar1 = new ProgressBar.Circle("#spinner", {
    color: randomColor(),
    duration: 3000,
    easing: "easeInOut",
    text: {
      value: "0",
    },
    step: function (state, circle, attachment) {
      circle.setText((circle.value() * 100).toFixed(0));
    },
  });

  function test() {
    bar1.animate(1.0);
    return;
  }

  function x() {
    cLog(b);
  }

  x();
  test();
}

/**
 * Function to create a box around text with specified options.
 *
 * @param {string} text - The text to display in the box.
 * @param {string} color - The color for the box (default is "yellow").
 * @returns {string} The text enclosed in a box with specified options.
 */
function inBox(text, color = "yellow") {
  const b = box({
    text,
    width: "60",
    height: "3",
    hAlign: "center",
    vAlign: "center",
    float: "center",
    padding: 0,
    border: { type: "line", fg: `${color}` },
  });
  return b;
}

/**
 * Function to get a random color from a cache.
 *
 * @returns {string} A random color code.
 */
function getColor() {
  let colors = [
    "black",
    "red",
    "green",
    "yellow",
    "blue",
    "magenta",
    "cyan",
    "white",
  ];
  let i = Math.floor(Math.random() * 8);
  return colors[i];
}

/**
 * Function to check for curse words in an input string.
 *
 * @param {string} input - The input string to check for curse words.
 * @returns {boolean} True if curse words are found, otherwise false.
 */
function checkForCurseWords(input) {
  let badWordsArray = require("bad-words");
  let filter = new badWordsArray();
  if (filter.isProfane(input)) {
    return true;
  } else {
    return false;
  }
}

/**
 * Function to delay execution for a specified time.
 *
 * @param {number} ms - The time to delay in milliseconds.
 * @returns {Promise<void>} A promise that resolves after the delay.
 */
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * Function to extract the domain from a URL.
 *
 * @param {string} url - The URL to extract the domain from.
 * @returns {string} The extracted domain.
 */
function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch (error) {
    logError(error, "Error while extracting the domain from a URL.");
  }
}

/**
 * Function to schedule another function after a delay.
 *
 * @param {Function} func - The function to schedule.
 * @param {number} delay - The delay in milliseconds.
 * @param {...any} args - Additional arguments to pass to the scheduled function.
 */
const scheduleFunction = async (func, delay, ...args) => {
  await new Promise((resolve) => setTimeout(resolve, delay));
  func(...args);
};

/**
 * Function to shorten a string to a maximum length.
 *
 * @param {string} chars - The input string to be shortened.
 * @param {number} max - The maximum length of the shortened string.
 * @returns {string} The shortened string.
 */
const capLength = (chars, max) => {
  if (chars.length > max) {
    return chars.substring(0, max) + "...";
  }
  return chars;
};

// All Functions Contained Within This File
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