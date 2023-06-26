const express = require("express");
const { getTopics } = require("./__controllers__/topics.controller");
const { getAll } = require("./__controllers__/all.controller");
const { getArticleById } = require("./__controllers__/article.controller");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

app.all("*", getAll);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid Request" });
  } else next(err);
});
app.use((err, req, res, next) => {
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});
app.use((err, req, res, next) => {
  if (err) {
    console.log(err);
  }
});
module.exports = app;
