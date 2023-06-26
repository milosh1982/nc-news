const { selectApi } = require("../__model__/api.model");

exports.getApi = (req, res, next) => {
  selectApi()
    .then((allApi) => {
      res.status(200).send({ allApi });
    })
    .catch(next);
};
