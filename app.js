const express = require("express");
const { getTopics } = require("./__controllers__/topics.controller");
const { getAll } = require("./__controllers__/all.controller");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.all("*", getAll);
module.exports = app;
