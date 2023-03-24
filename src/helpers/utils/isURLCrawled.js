const Content = require("../../models/Content");
const extractNumbersFromString = require("./extractNumbersFromString");

async function isURLCrawled(url = "https://myanmarload.com") {
  const content_id = extractNumbersFromString(url);
  const content_ids = await Content.findAll({ attributes: ["content_id"] });
  const crawled = content_ids.filter((id) => content_id == id);

  if (crawled.length > 0) {
    return true;
  }
  return false;
}

module.exports = isURLCrawled;