const exportJsonFile = require("../helpers/exportJsonFile");
const puppeteer = require("puppeteer");
const getContents = require("../helpers/getContents");

async function webCrawlerController(req, res) {
  const url = req.body.targetUrl;

  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);

    const contents = await getContents(page, 4);

    await browser.close();

    console.log(contents.length);

    res.render("index", { contents }); //send to view

    exportJsonFile(url, contents); // export to json file
  })();
}

module.exports = webCrawlerController;
