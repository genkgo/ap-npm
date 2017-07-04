import authLogin from '../../src/routes/auth-user-login';
import httpRequest from '../mocks/httpRequestMock';
import httpResponse from '../mocks/httpResponseMock';
import authTrue from '../mocks/authTrueMock';
import authFalse from '../mocks/authFalseMock';
import crypto from 'crypto';

const expect = require('chai').expect;

describe('Route auth-user-login', function () {

  it('should log user in with correct credentials', function () {
    let req = new httpRequest();
    let res = new httpResponse();
    let auth = new authTrue();
    let tokenLength = crypto.randomBytes(64).toString('hex').length;
    let route = new authLogin(auth);

    req.body = {
      name: 'name',
      password: 'password',
      email: 'test@apnpm.com',
      type: null
    };

    route.process(req, res)
      .then(() => {
        expect(auth.username).to.equal('name');
        expect(res.gotSend.token.length).to.equal(tokenLength);
      });
  });

  it('should not log in with incorrect credentials', function () {
    let req = new httpRequest();
    let res = new httpResponse();
    let auth = new authFalse();
    let route = new authLogin(auth);

    req.body = {
      name: 'name',
      password: 'password',
      email: 'test@apnpm.com',
      type: null
    };

    route.process(req, res)
      .catch(() => {
        expect(res.statusCode).to.equal(401);
      })
  });

});