const db = require("../db/connection");

exports.selectArticleById = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
};

exports.selectArticle = (topic, sort_by = "created_at", order = "desc") => {
  const validSortBy = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];
  const validOrder = ["asc", "desc"];
  if (!validSortBy.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return db
    .query(
      "SELECT articles.article_id, COUNT(articles.article_id) FROM articles JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id"
    )
    .then(({ rows }) => {
      return rows;
    })
    .then((count) => {
      let queryStr = `SELECT author, title, article_id, topic, created_at, votes, article_img_url FROM articles`;

      if (topic) {
        const validTopic = [
          "mitch",
          "cats",
          "paper",
          "coding",
          "football",
          "cooking",
        ];
        if (!validTopic.includes(topic)) {
          return Promise.reject({ status: 404, msg: "Not found" });
        }
        queryStr += ` WHERE articles.topic = ` + "'" + topic + "'";
      }
      if (sort_by) {
        queryStr += ` ORDER BY ${sort_by}`;
      }
      if (order) {
        const orderToUpper = order.toUpperCase();
        queryStr += ` ${orderToUpper}`;
      }
      return db.query(queryStr).then((articles) => {
        const newData = articles.rows.map((article) => {
          article.comment_count = 0;
          count.forEach((el) => {
            if (el.article_id === article.article_id) {
              article.comment_count = Number(el.count);
            }
          });
          return article;
        });
        return newData;
      });
    });
};

exports.selectPostComment = (id, username, body) => {
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Invalid Request" });
  }
  return db
    .query(
      "INSERT INTO comments (body, votes, author, article_id) VALUES ($1, $2, $3, $4) RETURNING *;",
      [body, 2, username, id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
exports.selectComments = (id) => {
  return db
    .query(
      "SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, articles.article_id FROM articles JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 ORDER BY comments.created_at DESC;",
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows;
    });
};

exports.selectPatchVotesArticle = (id, patch) => {
  if (!patch || !patch.inc_votes) {
    return Promise.reject({ status: 400, msg: "Invalid Request" });
  }
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`,
      [patch.inc_votes, id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
};

exports.selectDeleteComment = (id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
};

exports.selectGetUsers = () => {
  return db
    .query("SELECT username, name, avatar_url FROM users;")
    .then(({ rows }) => {
      return rows;
    });
};
