const getContentsFromMyanmarload = require("../helpers/getContentsFromMyanmarload");
const Content = require("../models/Content");
const isURLCrawled = require("../helpers/utils/isURLCrawled");
const getContentsFromMizzima = require("../helpers/getContentsFromMizzima");
const exportJsonFile = require("../helpers/utils/exportJsonFile");
const getContentsFromEleven = require("../helpers/getContentFromEleven");

const creatContent = async (req, res) => {
  const url = req.body.targetUrl;
  const contents = [];
  const listCrawledUrl = [];

  let browser;
  for (let i = 0; i < 500; i++) {
    try {
      browser = await puppeteer.launch({ headless: true, product: 'chrome' });
      const page = await browser.newPage();

      const contentId = extractNumbersFromString(url);
      const newUrl = replaceString(
        url,
        contentId,
        (parseInt(contentId, 10) + i).toString()
      );

      await page.goto(newUrl, {
        waitUntil: "domcontentloaded",
        timeout: 0,
      });

      // const content = await getContentFromMyanmarload(page);

      // const content = await getContentsFromMyanmarNow(page);

      // const content = await getContentFromMizzima(page);

      const content = await getContentFromEleven(page);

      if (content[0] !== undefined) {
        contents.push(content[0]);
        listCrawledUrl.push(newUrl);
      }

      console.log(newUrl);
      await browser.close();
    } catch (error) {
      if (error.message.toString().includes("failed to find element")) {
        console.error("FAILED TO FIND ELEMENT-------SKIP");
        await browser.close();
      } else if (error.message.toString().includes("net::ERR_")) {
        console.log("ATTEMPTING TO RECONNECT IN 60 SECONDS...");
        await new Promise((resolve) => setTimeout(resolve, 60000));
        --i;
      } else {
        console.error(error);
        await browser.close();
      }
    }
  }

  console.log(contents.length + "crawled");

  ////save to postgres
  // contents.forEach((content) => {
  //   Content.create({
  //     content_id: content.id,
  //     title: content.title,
  //     category: content.category,
  //     posted_time: content.posted_time,
  //     sub_title: content.sub_title,
  //     content: content.content,
  //   })
  //     .then((data) => console.log(data.id))
  //     .catch((error) => console.log(error));
  // });
  // res.status(200).json(contents);

  exportJsonFile(url, contents);
  res.redirect("/");
};

module.exports = { creatContent };
