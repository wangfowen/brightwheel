process.env.NODE_ENV = 'test';

let chai = require("chai");
let chaiHttp = require("chai-http");
let app = require("../server/app");
let should = chai.should();
chai.use(chaiHttp);

describe("/POST email", () => {
  it("should succeed", (done) => {
    chai.request(app)
      .post("/email")
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
