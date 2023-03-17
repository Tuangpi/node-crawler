const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const compression = require("compression");

const routes = require("./routes/routes");

const app = express();

app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use("/", routes);

module.exports = app;
