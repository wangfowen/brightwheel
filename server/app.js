let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let { errorHandler, cleanBody } = require("./helpers");

app.use(bodyParser.json());
app.use(errorHandler);

app.post("/email", (req, res, next) => {
  const { to, to_name, from, from_name, subject, body } = req.body;
  if (!to || !to_name || !from || !from_name || !subject || !body) {
    return next(new Error("missing params in request"));
  }

  const cleanedBody = cleanBody(body);

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

module.exports = app;
