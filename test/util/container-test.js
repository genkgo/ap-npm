import Container from '../../src/util/container';
const expect = require('chai').expect;

const container = new Container();

describe("Dependency Container", function () {
  it("Should set a dep", function () {
    container.set('my-dep', function () {
      return "working";
    });
  });

  it("Should get a dep", function () {
    expect(container.get('my-dep')).to.equal("working");
  });

  it("Should throw error when dep does not exist", function () {
    let dep = "non-existent";
    try {
      container.get(dep);
    } catch (err) {
      expect(err.message).to.equal('Cannot find service ' + dep);
    }
  })
});
