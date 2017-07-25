let { cleanBody } = require("../server/helpers");
let chai = require("chai");
let should = chai.should();

describe("clean body", () => {
  it("should remove html tags", () => {
    const text = "<h1>Your Bill</h1><p>$10</p>";
    cleanBody(text).should.equal("Your Bill\n$10\n");
  });

  it("should work with attributes on the tags", () => {
    const text = "<h1 class='test'>Your Bill</h1>";
    cleanBody(text).should.equal("Your Bill\n");
  });

  it("should work with open-ended tags", () => {
    const text = "<h1>Test</h1><br />";
    cleanBody(text).should.equal("Test\n");
  });

  it("should only newline once for nested tags", () => {
    const text = "<div><h1>Test</h1></div>";
    cleanBody(text).should.equal("Test\n");
  });
});
