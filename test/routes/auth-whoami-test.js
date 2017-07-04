import authLogin from '../../src/routes/auth-whoami';
import httpRequest from '../mocks/httpRequestMock';
import httpResponse from '../mocks/httpResponseMock';
import authTrue from '../mocks/authTrueMock';

const expect = require('chai').expect;

describe('Route auth-whoami', function () {

  it('should return username to valid user', function () {
    let req = new httpRequest();
    let res = new httpResponse();
    let auth = new authTrue();
    let route = new authLogin(auth);
    let token = '123456789';

    req.headers.authorization = 'Bearer ' + token;

    route.process(req, res)
      .then(() => {
          expect(res.gotSend.username).to.equal('username');
        }
      );
  });

  it('should return 401 when user is not logged in', function () {
    let req = new httpRequest();
    let res = new httpResponse();
    let auth = new authTrue();
    let route = new authLogin(auth);
    let token = 'invalid';

    req.headers.authorization = 'Bearer ' + token;

    route.process(req, res)
      .then(() => {
          expect(res.gotSend).to.equal('Invalid user');
        expect(res.statusCode).to.equal(401);
        }
      );
  })

});