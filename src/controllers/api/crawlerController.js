const puppeteer = require("puppeteer");

const getContentsFromMyanmarload = require("../../helpers/getContentsFromMyanmarload");
const Content = require("../../models/Content");
const isURLCrawled = require("../../helpers/utils/isURLCrawled");
const getContentsFromMizzima = require("../../helpers/getContentsFromMizzima");
const getContentsFromEleven = require("../../helpers/getContentFromEleven");
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

  for (let i = 0; i < 1000; i++) {
    const browser = await puppeteer.launch({ headless: true });
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

    const content = await getContentsFromMyanmarload(page);

    // const content = await getContentsFromMizzima(page);

    // const content = await getContentsFromEleven(page);

    if (content[0] !== undefined) {
      contents.push(content[0]);
      listCrawledUrl.push(url);
    }

    console.log(i);
    await browser.close();
  }

  console.log(contents.length);

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
  exportJsonFile("https://listurl.com/article/83000", listCrawledUrl);
};

module.exports = { crawledContents };