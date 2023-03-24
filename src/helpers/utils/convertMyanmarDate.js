const moment = require("moment");
const myanmarNumbers = require("myanmar-numbers");
const replaceFromString = require("./replaceString");

function convertMyanmarDate(mmdate) {
  if (Array.isArray(mmdate)) {
    if (mmdate.length > 1) {
      const splitDate = myanmarNumbers(mmdate[0]).split("-");
      const splitTime = myanmarNumbers(mmdate[1].split("/U+00a0/"));

      let month = null;
      switch (splitDate[1]) {
        case "ဇန်":
          month = "Jan";
          break;
        case "ဖေ":
          month = "Feb";
          break;
        case "မတ်":
          month = "Mar";
          break;
        case "ဧ":
          month = "Apri";
          break;
        case "မေ":
          month = "May";
          break;
        case "ဇွန်":
          month = "June";
          break;
        case "ဇူ":
          month = "July";
          break;
        case "သြ":
          month = "Aug";
          break;
        case "စက်":
          month = "Sep";
          break;
        case "အောက်":
          month = "Oct";
          break;
        case "နို":
          month = "Nov";
          break;
        case "ဒီ":
          month = "Dec";
          break;
        default:
          month = "May";
          break;
      }
      const result =
        splitDate[0] +
        "-" +
        month +
        "-" +
        splitDate[2] +
        " " +
        splitTime[1] +
        splitTime[2] +
        splitTime[3];
      return moment(
        replaceFromString(result, /\U+00a0/, ""),
        "DD-MMM-YYYY hh a"
      ).format();
    }
  }
  return null;
}
module.exports = convertMyanmarDate;
