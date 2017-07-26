let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let { errorHandler, cleanBody } = require("./helpers");

module.exports = class EmailController {
  constructor(emailClient) {
    this.emailClient = emailClient;
    this.app = app;
  }

  start() {
    app.use(bodyParser.json());
    app.use(errorHandler);

    app.post("/email", (req, res, next) => {
      const { to, to_name, from, from_name, subject, body } = req.body;
      const params = {to, to_name, from, from_name, subject, body}
      for (let key of Object.keys(params)) {
        if (!params[key] || params[key] == "") {
          return next(new Error("missing request field '" + key + "'"));
        }
      }

      const cleanedBody = cleanBody(body);
      this.emailClient.sendEmail(to, to_name, from, from_name, subject, cleanedBody, () => {
        res.sendStatus(200);
      });
    });

    this.listener = app.listen(3000, () => {
      console.log("Listening on port 3000");
    });
  }

  shutdown() {
    this.listener.close();
  }
}
