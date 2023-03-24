const express = require("express");
const helmet = require("helmet");
const path = require("path");
const compression = require("compression");

const routes = require("./routes/routes");
const apiRouter = require("./routes/api");

const app = express();

//Express middleware
app.use(compression());
// app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Views
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

//Routes
app.use("/", routes);

app.use("/api", apiRouter);

//Not found
app.use((req, res, next) => {
  const err = new Error(`${req.url} not found in this server`);
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;
