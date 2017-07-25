let request = require("request-promise");
let querystring = require("querystring");

class EmailClient {
  constructor() {}

  sendEmail(to, toName, from, fromName, subject, body, callback) {
    throw new Error("implement me!");
  }
}

class MailgunClient extends EmailClient {
  constructor(apiKey, url) {
    super();
    this.apiKey = apiKey;
    this.url = url;
  }

  mailgunUri() {
    return "https://api:" + this.apiKey + "@" + this.url.replace(/^https:\/\//, "");
  }

  combinedName(email, name) {
    return name + " <" + email + ">";
  }

  sendEmail(to, toName, from, fromName, subject, body, callback) {
    const combinedTo = this.combinedName(to, toName);
    const combinedFrom = this.combinedName(from, fromName);
    const queryBody = querystring.stringify({
      subject,
      text: body,
      to: combinedTo,
      from: combinedFrom
    });

    const options = {
      method: "POST",
      uri: this.mailgunUri(),
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      body: queryBody
    };

    request(options)
      .then(() => {
        callback();
      })
      .catch((err) => {
        throw err;
      });
  }
}

class SendgridClient extends EmailClient {
  constructor(apiKey, url) {
    super();
    this.apiKey = apiKey;
    this.url = url;
  }

  sendEmail(to, toName, from, fromName, subject, body, callback) {
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

    const options = {
      method: "POST",
      uri: this.url,
      headers: {
        "Authorization": "Bearer " + this.apiKey,
        "content-type": "application/json"
      },
      body: queryBody,
      json: true
    };

    request(options)
      .then(() => {
        callback();
      })
      .catch((err) => {
        throw err;
      });
  }
}

class TestClient extends EmailClient {
  constructor() { super(); }

  sendEmail(to, toName, from, fromName, subject, body, callback) {
    callback();
  }
}

module.exports = {
  MailgunClient,
  SendgridClient,
  TestClient
}
