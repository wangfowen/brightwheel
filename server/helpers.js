const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500);
  res.render("error", { error: err });
}

const cleanBody = (body) => {
  return body
    /*
     * this could be made much smarter
     * - for tags like span, we can space instead of newline
     * - we can remove newline if there are multiple in a row, or if it's at the end of a block of content
     *
     * but for these, need to consider further if it actually makes sense even in corner cases
     * even the current code would produce unwanted behavior if there's brackets in the normal text, but that seems like an unlikely occurence
     */
    .replace(/<\/[^>]+>/g, "\n")
    .replace(/<[^>]+>/g, "");
}

const combinedName = (email, name) => {
  return name + " <" + email + ">";
}

const mailgunUri = (api, url) => {
  return "https://api:" + api + "@" + url;
}

module.exports = {
  errorHandler,
  cleanBody,
  combinedName,
  mailgunUri
};
