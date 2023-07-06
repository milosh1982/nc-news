function checkValidQuery(queries) {
  const validQuery = ["topic", "sort_by", "order"];
  const queryKeys = Object.keys(queries);
  if (queryKeys.length > 0) {
    const filteredQuery = validQuery.filter((query) =>
      queryKeys.includes(query)
    );
    if (filteredQuery.length === 0) {
      return Promise.reject({ status: 400, msg: "Bad request" });
    }
  }
}
module.exports = checkValidQuery;
