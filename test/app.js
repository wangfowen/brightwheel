process.env.NODE_ENV = 'test';

let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("../server/app");
let should = chai.should();
chai.use(chaiHttp);

const req = (
  resp,
  to = "fake@example.com",
  to_name = "Mr. Fake",
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
    .end((err, res) => resp(err, res));
}

describe("/POST email", () => {
  it("should succeed", (done) => {
    req((err, res) => {
      res.should.have.status(200);
      done();
    });
  });

  it("should fail if params are missing", (done) => {
    chai.request(app)
      .post("/email")
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  });
});
