/**
 * Runs a function every X minutes for a maximum number of loops.
 *
 * @param {number} minutes - The number of minutes to wait between function runs.
 * @param {function} func - The function to run.
 * @param {object} [vars={}] - An object containing the variables to pass to the function.
 * @param {number} [maxLoops=Infinity] - The maximum number of loops to run the function.
 */
const runFunctionEveryXMinutes = (minutes, func, vars = {}, maxLoops = Infinity) => {
    let loops = 0;
    const interval = setInterval(async () => {
        try {
            // Extract the possible variable values from the vars object
            const varValues = Object.values(vars);
            // Call the function with the extracted values; if vars is empty, this will be equivalent to calling the function with no arguments
            await func(...varValues);
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
