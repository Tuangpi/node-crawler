function extractNumbersFromString(str) {
  if (str) {
    return str.match(/\d+/g).join("");
  }
}
module.exports = extractNumbersFromString;
