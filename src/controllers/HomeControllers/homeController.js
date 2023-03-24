const Content = require("../../models/Content");

async function index(req, res) {
  const contents = await Content.findAll({ order: [["id", "desc"]] });
  res.render("index", {
    contents: contents,
  });
}

module.exports = { index };
