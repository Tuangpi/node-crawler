const moment = require("moment");

const extractNumbersFromString = require("./utils/extractNumbersFromString");
const replaceString = require("./utils/replaceString");
const joinArray = require("./utils/joinArray");
const checkAndConvertYoutubeVideoUrl = require("./utils/checkAndConvertYoutubeVideoUrl");

async function getContentsFromMizzima(page) {
  const contents = [];
  const ids = [];
  
  try {
    const content = await page.$eval(".region-two-66-33-first", (element) => ({
      sourceAuthor:
        element.querySelector(".news-details-author-by")?.innerText ||
        "no author found",
      title:
        element.querySelector(".news-details-title")?.innerText ||
        "no title found",
      category: Array.from(
        element.querySelectorAll(".news-details-category a")
      ).map((e) => e.innerText || "no category found"),
      createdAt: element.querySelector(".news-details-date").innerText,
      content: Array.from(element.querySelectorAll(".node-content p")).map(
        (e) => e.outerHTML || "no content found"
      ),
      contentSnippet: Array.from(
        element.querySelectorAll(".node-content p")
      ).map((e) => e.innerText),
      sourceImages: Array.from(
        element.querySelectorAll(
          ".news-details-image > img, .news-details-image iframe, .view-news-details-small-images img"
        )
      ).map((e) => e.getAttribute("src")),
    }));

    contents.push(content);
  } catch (error) {
    console.error(error);
  }

  ids.push(await page.url()); //get urls

  if (contents.length > 0) {
    const mizzimaContents = contents.map((item, index) => {
      item.createdAt = moment(item.createdAt, "DD MMM YYYY").format();
      item.updatedAt = item.createdAt;
      item.contentSnippet = joinArray(item.contentSnippet);
      item.sourceAuthor = replaceString(item.sourceAuthor, "By ", "");
      item.sourceImages[0] = checkAndConvertYoutubeVideoUrl(
        item.sourceImages[0]
      );

      return {
        sourceUrl: ids[index],
        sourceId: extractNumbersFromString(ids[index]),
        featuredImage: item.sourceImages[0],
        ...item,
      };
    });
    return mizzimaContents;
  }
  return [];
}

module.exports = getContentsFromMizzima;
