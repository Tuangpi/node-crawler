const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const webCrawlerController = require("./src/controllers/webCrawlerController");
const homeController = require("./src/controllers/HomeControllers/homeController");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "src/public")));
app.set("view engine", "ejs");
app.set("views", "./src/views");

app.get("/", homeController);

app.post("/crawl", webCrawlerController);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
