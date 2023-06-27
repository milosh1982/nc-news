const { selectApi } = require("../utility-fun/getApi");

exports.getApi = (req, res, next) => {
  selectApi()
    .then((getApi) => {
      res.status(200).send({ getApi });
    })
    .catch(next);
};
