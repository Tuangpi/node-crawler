const moment = require("moment");

const joinArray = require("./utils/joinArray");
const extractNumbersFromString = require("./utils/extractNumbersFromString");

async function getContentsFromEleven(page) {
  const contents = [];
  const ids = [];

  try {
    const content = await page.$eval(".article", (element) => ({
      sourceAuthor:
        element.querySelector(".news-detail-date-author-info-author")
          ?.innerText || "no author found",
      title:
        element.querySelector(".news-detail-title")?.innerText ||
        "no title found",
      category:
        element.querySelector(".news-detail-news-category").innerText ||
        "no category found",
      createdAt: element.querySelector(".news-detail-date-author-info-date")
        .innerText,
      content: Array.from(element.querySelectorAll(".node-content p")).map(
        (e) => e.outerHTML || "no content found"
      ),
      contentSnippet: Array.from(
        element.querySelectorAll(".node-content p")
      ).map((e) => e.innerText),
      sourceImages: Array.from(element.querySelectorAll(".news-image img")).map(
        (e) => e.getAttribute("src")
      ),
    }));

    contents.push(content);
  } catch (error) {
    console.error(error);
  }

  ids.push(await page.url()); //get urls

  if (contents.length > 0) {
    const elevenContents = contents.map((item, index) => {
      item.createdAt = moment(item.createdAt, "DD MMM YYYY").format();
      item.updatedAt = item.createdAt;
      item.contentSnippet = joinArray(item.contentSnippet);

      return {
        sourceUrl: ids[index],
        sourceId: extractNumbersFromString(ids[index]),
        featuredImage: item.sourceImages[0],
        ...item,
      };
    });

    return elevenContents;
  }
  return [];
}

module.exports = getContentsFromEleven;
