const { Storage } = require("megajs");

const MAX_RETRIES = 3;
require("dotenv").config({ path: "../../../../my.env" });
const mega_email = `${process.env.MEGA_EMAIL}`; 
const mega_password = `${process.env.MEGA_PASSWORD}`; 
const theClient = require("../../index.js");

/**
 * Retry the execution of a function for a maximum number of attempts.
 *
 * @param {Function} func - The function to retry.
 * @param {number} maxAttempts - The maximum number of attempts to retry the function.
 * @throws {Error} Throws the last error if all attempts fail.
 */
async function retryWithMaxAttempts(func, maxAttempts) {
  let attempts = 0;
  let lastError = null;

  while (attempts < maxAttempts) {
    try {
      attempts++;
      await func();
      return; // Successful, exit the loop
    } catch (error) {
      lastError = error;
      console.error(`Error during attempt ${attempts}:`, error);
      // Delay before the next retry
      await new Promise(resolve => setTimeout(resolve, 1000)); // Adjust the delay time if needed
    }
  }

  throw lastError; // Throw the last error if all attempts failed
}

async function login_mega(client = theClient, email = mega_email, password = mega_password) {
  try {
    const mega = new Storage({ email: email, password: password });
  
    try {
      console.log("Attempting Mega Client Log In")
      let attempts = 0;
      let lastError = null;
      let delay = 1000; // Initial delay in milliseconds
    
      while (attempts < 3) {
        try {
          attempts++;
          await mega.login()
          console.log("Mega Client Login successful!");
          client.connectedToMega = true;
          client.Mega = mega;
          return mega;
        } catch (error) {
          lastError = error;
          console.error(`Error during attempt ${attempts}:`, error);
          
          // Exponential backoff: Increase delay before the next retry
          delay *= 2; // You can adjust the multiplier as needed
          
          console.log(`Retrying in ${delay} milliseconds...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
      throw lastError; // Throw the last error if all attempts failed
      
    } catch (error) {
      client.connectedToMega = false;
      console.error("Error:", error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}


module.exports = {
    login_mega
};