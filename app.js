const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getAll } = require("./controllers/all.controller");
const { getApi } = require("./controllers/api.controller");
const {
  getArticleById,
  getArticle,
  postComment,
  getComments,
  patchVotesArticle,
  deleteComment,
} = require("./controllers/article.controller");
const app = express();
app.use(express.json());

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticle);
app.post("/api/articles/:article_id/comments", postComment);
app.get("/api/articles/:article_id/comments", getComments);
app.patch("/api/articles/:article_id", patchVotesArticle);
app.delete("/api/comments/:comment_id", deleteComment);

app.all("*", getAll);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid Request" });
  } else next(err);
});
app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "Not found" });
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
