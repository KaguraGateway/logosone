/**
 * Example utility function to demonstrate Biome linting
 * @param {string} message - The message to log
 * @returns {string} The original message
 */
export function logMessage(message: string): string {
  // This will trigger a linting warning for console.log
  console.log(message);
  
  // Unused variable will trigger a linting warning
  const unusedVar = 'This variable is not used';
  
  return message;
}
