let request = require("request-promise");

module.exports = class EmailClient {
  constructor() {}

  //this will error unless overridden
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
