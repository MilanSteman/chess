/**
 * Checks whether a string is uppercase or not
 * @returns True if the string is fully uppercase
 */
function isUpperCase(str: string): boolean {
  return str === str.toUpperCase();
}

export { isUpperCase };