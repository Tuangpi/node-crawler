const extractNumbersFromString = require("../utils/extractNumbersFromString");

async function getContents(page, pageCount) {
  let contents = [];
  let urls = [];

  while (pageCount >= contents.length) {
    contents = await page.evaluate(() => {
      const items = Array.from(
        document.querySelectorAll(".grid-article-detail")
      );

      return items.map((item) => {
        const title = item.querySelector("h1")?.outerHTML || "no title found";

        const category =
          item.querySelector(".article-summary-category")?.outerHTML ||
          "no category found";

        const dateTime = Array.from(
          item.querySelectorAll(".article-summary-datetime")
        ).map((time) => time.outerHTML);

        const subTitle =
          item.querySelector(".article-summary-title-sub")?.outerHTML ||
          "no subTitle found";

        const content = Array.from(
          item.querySelectorAll(
            ".grid-article-content > p, .article-content-image-modal, .article-tags, .article-celebrities, .article-content-embed youtube"
          )
        ).map((content) => content.outerHTML);

        return {
          title,
          category,
          dateTime,
          subTitle,
          content,
        };
      });
    });

    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)"); // auto scroll

    urls.push(await page.url()); //get urls
  }

  const uniqueURLS = Array.from(new Set(urls)); // urls duplicate, so remove duplicate urls

  const combinedArray = contents.map((item, index) => {
    return { id: extractNumbersFromString(uniqueURLS[index]), ...item };
  });
  combinedArray.pop(); // always contain null in the last array so remove it

  return combinedArray;
}

module.exports = getContents;
