let EmailClient = require("./EmailClient");
let querystring = require("querystring");

module.exports = class MailgunClient extends EmailClient {
  constructor(config) {
    super();
    this.apiKey = config.get("mailgun.apiKey");
    this.url = config.get("mailgun.url");
  }

  mailgunUri() {
    return "https://api:" + this.apiKey + "@" + this.url.replace(/^https:\/\//, "");
  }

  combinedName(email, name) {
    return name + " <" + email + ">";
  }

  mkOptions(to, toName, from, fromName, subject, body) {
    const combinedTo = this.combinedName(to, toName);
    const combinedFrom = this.combinedName(from, fromName);
    const queryBody = querystring.stringify({
      subject,
      text: body,
      to: combinedTo,
      from: combinedFrom
    });

    return {
      method: "POST",
      uri: this.mailgunUri(),
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      body: queryBody
    };
  }
}
