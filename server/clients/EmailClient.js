let request = require("request-promise");

module.exports = class EmailClient {
  constructor() {}

  //options to be passed into the request for sending email
  //request will fail unless this gets overridden with actual content
  mkOptions(to, toName, from, fromName, subject, body) {
    return {};
  }

  sendEmail(to, toName, from, fromName, subject, body, callback) {
    const options = this.mkOptions(to, toName, from, fromName, subject, body);

    request(options)
      .then(() => {
        callback();
      })
      .catch((err) => {
        throw err;
      });
  }
}
