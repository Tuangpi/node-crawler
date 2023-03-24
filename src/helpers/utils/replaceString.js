function replaceString(str, removeStr, replaceStr) {
  if (str !== null) {
    return str.replace(removeStr, replaceStr);
  }
  return null;
}
module.exports = replaceString;
