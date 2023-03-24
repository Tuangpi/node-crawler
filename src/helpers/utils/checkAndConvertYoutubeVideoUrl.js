const replaceFromString = require("./replaceString");

function checkAndConvertYoutubeVideoUrl(str) {
  if (str.includes("https://www.youtube.com/embed/")) {
    const absoluteCode = str.slice(30, 41);
    return "https://www.youtube.com/watch?v=" + absoluteCode;
  }
  return str;
}
module.exports = checkAndConvertYoutubeVideoUrl;
