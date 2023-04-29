const moment = require("moment");

const joinArray = require("./utils/joinArray");
const extractNumbersFromString = require("./utils/extractNumbersFromString");

async function getContentsFromMyanmarNow(page) {
  const contents = [];
  const ids = [];

  try {
    const content = await page.$eval("article", (element) => ({
      sourceAuthor:
        element.querySelector("h5")
          ?.innerText || "no author found",
      title:
        element.querySelector(".elementor-heading-title")?.innerText ||
        "no title found",
      shortContent: element.querySelector("h4")?.innerText || "no short content found",
      // category: Array.from(
      //   element.querySelectorAll(".entry-categories a")
      // ).map((e) => e.innerText || "no category found"),
      createdAt: element.querySelector(".elementor-icon-list-text").innerText,
      content: Array.from(element.querySelectorAll(".elementor-widget-container p")).map(
        (e) => e.outerHTML || "no content found"
      ),
      contentSnippet: Array.from(
        element.querySelectorAll(".elementor-widget-container p")
      ).map((e) => e.innerText),
      sourceImages: Array.from(
        element.querySelectorAll(".wp-caption img")
      ).map((e) => e.getAttribute("src")),
    }));
console.log('hi1')
    contents.push(content);
  } catch (error) {
    throw new Error(error.message);
  }

  ids.push(await page.url()); //get urls

  if (contents[0] != null) {
    const elevenContents = contents.map((item, index) => {
      if(item.createdAt != null){
        item.createdAt = moment(item.createdAt, "DD MMM YYYY").format();
      }
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

module.exports = getContentsFromMyanmarNow;
