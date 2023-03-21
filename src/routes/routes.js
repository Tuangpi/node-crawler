const express = require("express");
const router = express.Router();

const webCrawlerController = require("../controllers/webCrawlerController");
const homeController = require("../controllers/HomeControllers/homeController");

router.get("/", homeController);

router.post("/", webCrawlerController.creatContent);

module.exports = router;
