import authLogout from '../../src/routes/auth-user-logout';
import httpRequest from '../mocks/httpRequestMock';
import httpResponse from '../mocks/httpResponseMock';
import authTrue from '../mocks/authTrueMock';

const expect = require('chai').expect;

describe('Route auth-user-logout', function () {

  it('should logout user', function () {
    let req = new httpRequest();
    let res = new httpResponse();
    let auth = new authTrue();
    let route = new authLogout(auth);
    let token = '123456789';

    req.headers.authorization = 'Bearer ' + token;

    route.process(req, res)
      .then(() => {
        expect(auth.logoutToken).to.equal(token);
        expect(res.statusCode).to.equal(200);
        expect(res.gotSend.ok).to.equal('Logged out');
      });
  });

});