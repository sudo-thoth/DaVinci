/**
 * Runs a function every X minutes.
 *
 * @param {number} minutes - The number of minutes to wait between function runs.
 * @param {function} func - The function to run.
 */
const runFunctionEveryXMinutes = (minutes, func) => {
  setInterval(async () => {
    try {
      await func();
    } catch (error) {
      console.log(error, `Error in ${func.name}`);
    }
  }, minutes * 60 * 1000);
};

module.exports = runFunctionEveryXMinutes;
