import paramParser from '../../src/util/param-parser';
import httpRequest from '../mocks/httpRequestMock';
const expect = require('chai').expect;

describe("Param parser", function () {
  it("Should extract params from url", function () {
    let next = function() {
      return true;
    }
    let req = new httpRequest();
    req.url = "/@apnpm/apnpm?package=apnpm-1.0.0.tgz";
    paramParser(req, null, next);

    expect(req.params.package).to.equals("apnpm-1.0.0.tgz");
  });
});