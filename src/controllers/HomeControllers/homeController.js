function homeController(req, res) {
  res.render("index", {
    contents: "",
  });
}

module.exports = homeController;
