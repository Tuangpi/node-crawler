const getContentsFromMyanmarload = require("../helpers/getContentsFromMyanmarload");
const Content = require("../models/Content");
const isURLCrawled = require("../helpers/utils/isURLCrawled");
const getContentsFromMizzima = require("../helpers/getContentsFromMizzima");
const exportJsonFile = require("../helpers/utils/exportJsonFile");
const getContentsFromEleven = require("../helpers/getContentFromEleven");

const creatContent = async (req, res) => {
  const url = req.body.targetUrl;

  // if (await isURLCrawled(url)) {
  //   res.redirect("/");
  //   return;
  // }

  // const contents = await getContentsFromMyanmarload(url, 1);

  // const contents = await getContentsFromMizzima(url, 1);

  const contents = await getContentsFromEleven(url, 1);

  console.log(contents.length);

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
  res.redirect("/");
  exportJsonFile(url, contents);
};

module.exports = { creatContent };
