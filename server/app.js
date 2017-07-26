let config = require("config");

let EmailController = require("./EmailController")
let MailgunClient = require("./clients/MailgunClient");
let SendgridClient = require("./clients/SendgridClient");

const client = ((clientType) => {
  switch(clientType) {
    case 'mailgun':
      return new MailgunClient(config);
    case 'sendgrid':
      return new SendgridClient(config);
    default:
      throw new Error("client type not recognized: " + clientType);
  }
})(config.get("emailClient"));

const controller = new EmailController(client);
controller.start();
