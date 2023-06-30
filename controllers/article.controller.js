const {
  selectArticleById,
  selectArticle,
  selectPostComment,
  selectComments,
  selectPatchVotesArticle,
  selectDeleteComment,
  selectGetUsers,
} = require("../models/article.model");
const { checkUsernameExist } = require("../utility-fun/checkIdExist");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticle = (req, res, next) => {
  selectArticle()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { body } = req.body;
  const { username } = req.body;
  const { article_id } = req.params;
  const promise = [
    selectPostComment(article_id, username, body),
    checkUsernameExist(username),
  ];

  Promise.all(promise)
    .then((values) => {
      return values[0];
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  selectComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchVotesArticle = (req, res, next) => {
  const { article_id } = req.params;
  const body = req.body;
  selectPatchVotesArticle(article_id, body)
    .then((updated_article) => {
      res.status(201).send({ updated_article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  selectDeleteComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  selectGetUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};
