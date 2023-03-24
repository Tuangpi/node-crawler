const convertMyanmarDate = require("./utils/convertMyanmarDate");
const extractNumbersFromString = require("./utils/extractNumbersFromString");
const joinArray = require("./utils/joinArray");

async function getContentsFromMyanmarload(page) {
  const ids = [];
  const authors = [];
  const contents = [];

  try {
    const content = await page.$eval(".grid-article-detail", (element) => ({
      title: element.querySelector("h1")?.innerText || "no title found",
      categories: Array.from(
        element.querySelectorAll(".article-summary-category")
      ).map((e) => e.innerText || "no category found"),
      createdAt: Array.from(
        element.querySelectorAll(".article-summary-datetime")
      ).map((e) => e.innerText || "no created time found"),
      shortContent:
        element.querySelector(".article-summary-title-sub")?.innerText ||
        "no subTitle found",
      content: Array.from(
        element.querySelectorAll(
          ".grid-article-content > p, .article-content-image-modal, .article-tags, .article-celebrities, .article-content-embed youtube"
        )
      ).map((content) => content.outerHTML || "no content found"),
      contentSnippet: Array.from(
        element.querySelectorAll(".grid-article-content > p")
      ).map((content) => content.innerText),
      sourceImages: Array.from(
        element.querySelectorAll(
          ".grid-article-thumbnail > img, .article-content-image-modal > figure > img"
        )
      ).map((content) => content.getAttribute("src")),
    }));

    contents.push(content);
  } catch (error) {
    console.error(error);
  }

  try {
    const author = await page.$eval(
      ".article-related",
      (element) =>
        element.querySelector(".article-related-name").innerText ||
        "no author found"
    );

    authors.push(author);
  } catch (error) {
    console.error(error);
  }

  ids.push(await page.url()); //get urls

  if (contents.length > 0) {
    const myanmarloadContents = contents.map((item, index) => {
      item.createdAt = convertMyanmarDate(item.createdAt);
      item.updatedAt = item.createdAt;
      item.contentSnippet = joinArray(item.contentSnippet);

      return {
        sourceUrl: ids[index],
        sourceId: extractNumbersFromString(ids[index]),
        featuredImage: item.sourceImages[0],
        sourceAuthor: authors[index],
        ...item,
      };
    });

    return myanmarloadContents;
  }

  return [];
}

module.exports = getContentsFromMyanmarload;
