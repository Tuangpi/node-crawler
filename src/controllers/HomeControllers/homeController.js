const Content = require("../../models/Content");

async function homeController(req, res) {
  const contents = await Content.findAll({ order: [["id", "desc"]] });
  const paras = contents.map((content) => content.content);
  res.render("index", {
    contents: paras,
  });
}

module.exports = homeController;
