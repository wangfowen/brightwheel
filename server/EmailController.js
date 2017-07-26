let express = require("express");
let bodyParser = require("body-parser");
let { errorHandler, cleanBody, isValidEmail } = require("./helpers");

module.exports = class EmailController {
  constructor(emailClient) {
    this.emailClient = emailClient;
    this.app = express();
  }

  start() {
    this.app.use(bodyParser.json());
    this.app.use(errorHandler);

    this.app.post("/email", (req, res, next) => {
      const { to, to_name, from, from_name, subject, body } = req.body;
      const params = {to, to_name, from, from_name, subject, body}
      for (let key of Object.keys(params)) {
        if (!params[key] || params[key] == "") {
          return next(new Error("missing request field '" + key + "'"));
        }
      }
      if (!isValidEmail(to) || !isValidEmail(from)) {
        return next(new Error("invalid email field"));
      }

      const cleanedBody = cleanBody(body);
      this.emailClient.sendEmail(to, to_name, from, from_name, subject, cleanedBody, () => {
        res.sendStatus(200);
      });
    });

    this.listener = this.app.listen(3000, () => {
      console.log("Listening on port 3000");
    });
  }

  shutdown() {
    console.log("Shutting down controller");
    this.listener.close();
  }
}
