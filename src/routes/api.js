const express = require("express");
const apiRouter = express.Router();

const crawlerController = require("../controllers/api/crawlerController");

apiRouter.post("/", crawlerController.crawledContents);

module.exports = apiRouter;
