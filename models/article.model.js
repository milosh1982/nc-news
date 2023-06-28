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

exports.selectArticle = () => {
  return db
    .query(
      "SELECT articles.article_id, COUNT(articles.article_id) FROM articles JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id"
    )
    .then(({ rows }) => {
      return rows;
    })
    .then((count) => {
      return db
        .query(
          "SELECT author, title, article_id, topic, created_at, votes, article_img_url FROM articles ORDER BY created_at DESC;"
        )
        .then((articles) => {
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
  return db
    .query(
      "INSERT INTO comments (body, votes, author, article_id) VALUES ($1, $2, $3, $4) RETURNING *;",
      [body, 2, username, id]
    )
    .then(({ rows }) => {
      return rows;
    });
};
