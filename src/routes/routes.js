const express = require("express");
const router = express.Router();

const crawlerController = require("../controllers/crawlerController");
const homeController = require("../controllers/HomeControllers/homeController");

router.get("/", homeController.index);

router.post("/", crawlerController.creatContent);

module.exports = router;
