import authFalse from './mocks/authFalseMock';
import authTrue from './mocks/authTrueMock';
import httpRequest from './mocks/httpRequestMock';
import httpResponse from './mocks/httpResponseMock';
import access from '../src/auth/access';

const accessTrue = new access(new authTrue());
const accessFalse = new access(new authFalse());
const expect = require('chai').expect;

describe("Auth - access", function () {
  it("Should reject on not logged in", function () {
    let req = new httpRequest();
    let res = new httpResponse();
    res.status(200);

    req.params.package = "test-project";
    req.headers.authorization = "Bearer 12345";

    let next = function () {
      throw new Error("I should not be called");
    };

    return new Promise((resolve) => {
      accessFalse.can('publish').call('publish', req, res, next);
      resolve();
    }).then(() => {
      expect(res.gotSend).to.equal("401, unauthorized");
      expect(res.statusCode).to.equal(401);
    });
  });
});