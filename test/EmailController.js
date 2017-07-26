let chai = require("chai");
let chaiHttp = require("chai-http");
let should = chai.should();
chai.use(chaiHttp);
let config = require("config");

let EmailController = require("../server/EmailController");
let MailgunClient = require("../server/clients/MailgunClient");
let SendgridClient = require("../server/clients/SendgridClient");

const req = (
  app,
  test,
  to = "supernuber@gmail.com",
  to_name = "Owen Wang",
  from = "noreply@mybrightwheel.com",
  from_name = "Brightwheel",
  subject = "A Message from Brightwheel",
  body = "<h1>Your Bill</h1><p>$10</p>"
) => {
  chai.request(app)
    .post("/email")
    .send({
      to, to_name, from, from_name, subject, body
    })
    .end((err, res) => {
      if (err) {
        console.error(err);
      }

      test(err, res)
    });
}

const mailgunClient = new MailgunClient(config);
const sendgridClient = new SendgridClient(config);
const clients = { mailgunClient, sendgridClient };

for (let clientType of Object.keys(clients)) {
  describe(clientType, () => {
    const controller = new EmailController(clients[clientType]);
    controller.start();

    describe("/POST email", () => {
      it("should succeed", (done) => {
        req(controller.app, (err, res) => {
          res.should.have.status(200);
          done();
        });
      });

      it("should fail if params are missing", (done) => {
        chai.request(controller.app)
          .post("/email")
          .end((err, res) => {
            res.should.have.status(500);
            done();
          });
      });
    });

    controller.shutdown();
  });
}

