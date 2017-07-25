const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500);
  res.render("error", { error: err });
}

const cleanBody = (body) => {
  return body
    //close tags -> newlines
    .replace(/<\/[^>]+>/g, "\n")
    .replace(/<[^>]+>/g, "")
    //remove dupe newlines
    .replace(/(\n){2,}/g, "\n");
}

module.exports = {
  errorHandler,
  cleanBody
};
