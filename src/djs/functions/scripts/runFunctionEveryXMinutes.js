/**
 * Runs a function every X minutes for a maximum number of loops.
 *
 * @param {number} minutes - The number of minutes to wait between function runs.
 * @param {function} func - The function to run.
 * @param {number} [maxLoops] - The maximum number of loops to run the function.
 */
const runFunctionEveryXMinutes = (minutes, func, maxLoops = Infinity) => {
    let loops = 0;
    const interval = setInterval(async () => {
        try {
            await func();
        } catch (error) {
            console.log(error, `Error in ${func.name}`);
        }
        loops++;
        if (loops === maxLoops) {
            clearInterval(interval);
        }
    }, minutes * 60 * 1000);
};

module.exports = runFunctionEveryXMinutes;
