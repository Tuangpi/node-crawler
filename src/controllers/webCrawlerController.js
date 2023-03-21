const puppeteer = require("puppeteer");
const getContents = require("../helpers/getContents");
const Content = require("../models/Content");

const creatContent = (req, res) => {
  const url = req.body.targetUrl;

  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);

    const contents = await getContents(page, 3);

    await browser.close();

    console.log(contents.length);
    
    contents.forEach((content) => {
      Content.create({
        content: content,
      })
        .then((data) => data.id)
        .catch((error) => console.log(error));
    });
    res.render("index", { contents }); //send to view
  })();
};

const getAll = (req, res, next) => {
  Content.findAll()
    .then((u) => {
      console.log(u);
      res.json(u);
    })
    .catch((error) => console.log(error));
};

module.exports = { getAll, creatContent };
