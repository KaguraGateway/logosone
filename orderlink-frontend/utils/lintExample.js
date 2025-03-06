/**
 * Example utility function to demonstrate linting
 * @param {string} message - The message to log
 * @returns {void}
 */
export function logMessage(message) {
  // This will trigger a linting warning for console.log
  console.log(message);
  
  // Unused variable will trigger a linting warning
  const unusedVar = 'This variable is not used';
  
  return message;
}
