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

const isValidEmail = (email) => {
  //taken from RFC2822
  const regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  return regex.test(email);
}

module.exports = {
  errorHandler,
  cleanBody,
  isValidEmail
};
