const extractNumbersFromString = require("../helpers/extractNumbersFromString");

async function getContents(page, pageCount) {
  let contents = [];
  let urls = [];

  while (pageCount >= contents.length) {
    contents = await page.$$eval(".grid-article-detail", (element) =>
      element.map((e) => ({
        title: e.querySelector("h1")?.outerHTML || "no title found",
        category:
          e.querySelector(".article-summary-category")?.outerHTML ||
          "no category found",
        dateTime: Array.from(
          e.querySelectorAll(".article-summary-datetime")
        ).map((time) => time.outerHTML),
        subTitle:
          e.querySelector(".article-summary-title-sub")?.outerHTML ||
          "no subTitle found",
        content: Array.from(
          e.querySelectorAll(
            ".grid-article-content > p, .article-content-image-modal, .article-tags, .article-celebrities, .article-content-embed youtube"
          )
        ).map((content) => content.outerHTML),
      }))
    );

    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)"); // auto scroll

    urls.push(await page.url()); //get urls
  }

  const uniqueURLS = Array.from(new Set(urls)); // remove duplicate urls

  const combinedArray = contents.map((item, index) => {
    return { id: extractNumbersFromString(uniqueURLS[index]), ...item };
  });
  combinedArray.pop(); // always contain null in the last array so remove it

  return combinedArray;
}

module.exports = getContents;
