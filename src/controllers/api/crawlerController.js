const puppeteer = require("puppeteer");

const getContentFromMyanmarload = require("../../helpers/getContentsFromMyanmarload");
const Content = require("../../models/Content");
const isURLCrawled = require("../../helpers/utils/isURLCrawled");
const getContentFromMizzima = require("../../helpers/getContentsFromMizzima");
const getContentFromEleven = require("../../helpers/getContentFromEleven");
const extractNumbersFromString = require("../../helpers/utils/extractNumbersFromString");
const replaceString = require("../../helpers/utils/replaceString");
const exportJsonFile = require("../../helpers/utils/exportJsonFile");

const crawledContents = async (req, res) => {
  const url = req.body.targetUrl;
  const contents = [];
  const listCrawledUrl = [];

  // if (await isURLCrawled(url)) {
  //   res.redirect("/");
  //   return;
  // }
  let browser;
  for (let i = 0; i < 500; i++) {
    try {
      browser = await puppeteer.launch({ headless: true });
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
  listCrawledUrl.unshift(listCrawledUrl.length);
  exportJsonFile(url, contents);
  exportJsonFile("https://listurl.com/article/83000", listCrawledUrl);
};

module.exports = { crawledContents };
