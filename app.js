const express = require("express");
const { getTopics } = require("./controllers/topics.controller");
const { getAll } = require("./controllers/all.controller");
const { getApi } = require("./controllers/api.controller");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getApi);

app.all("*", getAll);

app.use((err, req, res, next) => {
  if (err) {
    console.log(err);
  }
});
module.exports = app;
