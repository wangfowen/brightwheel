let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let { errorHandler, cleanBody, combinedName, mailgunUri } = require("./helpers");
let request = require("request-promise");
let querystring = require("querystring");
let config = require("config");

app.use(bodyParser.json());
app.use(errorHandler);

app.post("/email", (req, res, next) => {
  const { to, to_name, from, from_name, subject, body } = req.body;
  if (!to || !to_name || !from || !from_name || !subject || !body) {
    return next(new Error("missing params in request"));
  }

  const cleanedBody = cleanBody(body);

  if (config.get("emailClient") === "mailgun") {
    const combinedTo = combinedName(to, to_name);
    const combinedFrom = combinedName(from, from_name);
    let uri = mailgunUri(process.env.MAILGUN_API_KEY, config.get("mailgun.url"));
    const queryBody = querystring.stringify({
      subject,
      text: cleanedBody,
      to: combinedTo,
      from: combinedFrom
    });
    const options = {
      method: "POST",
      uri,
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      body: queryBody
    };

    request(options)
      .then(() => {
        res.sendStatus(200);
      })
    .catch((err) => {
      console.log(err.message);
      return next(err);
    });
  } else {
    const queryBody = {
      "personalizations": [
        {
          "to": [
            {
              "email": to,
              "name": to_name
            }
          ],
          "subject": subject
        }
      ],
      "from": {
        "email": from,
        "name": from_name
      },
      "content": [
        {
          "type": "text/plain",
          "value": cleanedBody
        }
      ]
    };

    const options = {
      method: "POST",
      uri: config.get("sendgrid.url"),
      headers: {
        "Authorization": "Bearer " + process.env.SENDGRID_API_KEY,
        "content-type": "application/json"
      },
      body: queryBody,
      json: true
    };

    request(options)
      .then(() => {
        res.sendStatus(200);
      })
    .catch((err) => {
      console.log(err.message);
      return next(err);
    });
  }
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

module.exports = app;
