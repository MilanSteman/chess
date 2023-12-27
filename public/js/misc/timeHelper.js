/**
 * Formats time in seconds into a human-readable format (mm:ss).
 * @param {number} seconds - The time in seconds to be formatted.
 * @returns {string} The formatted time string in the "mm:ss" format.
 */
export const formatTime = (seconds) => {
  // Calculate minutes and remaining seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Create the formatted time string
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};
