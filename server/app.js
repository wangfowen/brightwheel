let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let config = require("config");

let { errorHandler, cleanBody } = require("./helpers");
let { MailgunClient, SendgridClient, TestClient } = require("./emailClient");

app.use(bodyParser.json());
app.use(errorHandler);

app.post("/email", (req, res, next) => {
  const { to, to_name, from, from_name, subject, body } = req.body;
  const params = {to, to_name, from, from_name, subject, body}
  for (let key of Object.keys(params)) {
    if (!params[key]) {
      return next(new Error("missing request field '" + key + "'"));
    }
  }

  let client = {};
  try {
    switch (config.get("emailClient")) {
      case "mailgun":
        const mgApi = process.env.MAILGUN_API_KEY;
        const mgUrl = config.get("mailgun.url");
        if (!mgApi) {
          return next(new Error("missing mailgun api key"));
        }

        client = new MailgunClient(mgApi, mgUrl);
        break;

      case "sendgrid":
        const sgApi = process.env.SENDGRID_API_KEY;
        const sgUrl = config.get("sendgrid.url");
        if (!sgApi) {
          return next(new Error("missing sendgrid api key"));
        }

        client = new SendgridClient(sgApi, sgUrl);
        break;

      default:
        client = new TestClient();
        break;
    }

    const cleanedBody = cleanBody(body);
    client.sendEmail(to, to_name, from, from_name, subject, cleanedBody, () => {
      res.sendStatus(200);
    });
  } catch(err) {
    return next(err);
  }
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

module.exports = app;
