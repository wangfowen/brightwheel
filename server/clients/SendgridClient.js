let EmailClient = require("./EmailClient");

module.exports = class SendgridClient extends EmailClient {
  constructor(config) {
    super();
    this.apiKey = config.get("sendgrid.apiKey");
    this.url = config.get("sendgrid.url");
  }

  mkOptions(to, toName, from, fromName, subject, body) {
    const queryBody = {
      "personalizations": [{
        "to": [{
          "email": to,
          "name": toName
        }],
        "subject": subject
      }],
      "from": {
        "email": from,
        "name": fromName
      },
      "content": [{
        "type": "text/plain",
        "value": body
      }]
    };

    return {
      method: "POST",
      uri: this.url,
      headers: {
        "Authorization": "Bearer " + this.apiKey,
        "content-type": "application/json"
      },
      body: queryBody,
      json: true
    };
  }
}

