import packageGet from '../../src/routes/package-get';
import StorageMock from '../mocks/storageMock';
import httpRequest from '../mocks/httpRequestMock';
import httpResponse from '../mocks/httpResponseMock';
import fs from 'fs';
import path from 'path';
import md5 from 'md5';

const expect = require('chai').expect;
const route = new packageGet(new StorageMock());

describe('Route package-get', function () {
  it('should give back unscoped packages', function () {
    let req = new httpRequest();
    let res = new httpResponse();

    req.body._scope = null;
    req.body._packageName = "test-project";
    req.body._requestedFile = "test-project-1.0.0.tgz";
    route.process(req, res).then(() => {
      expect(res.statusCode).to.equal(200);
      expect(md5(res.gotSend)).to.equal(
        md5(fs.readFileSync(path.join(__dirname, '..', 'filesystem', 'test-storage', 'test-project', 'test-project-1.0.0.tgz')))
      );
    });
  });

  it('should give back scoped packages', function () {
    let req = new httpRequest();
    let res = new httpResponse();

    req.body._scope = "@apnpm";
    req.body._packageName = "test-project";
    req.body._requestedFile = "test-project-1.0.0.tgz";
    route.process(req, res)
      .then(() => {
        expect(res.statusCode).to.equal(200);
        expect(md5(res.gotSend)).to.equal(
          md5(fs.readFileSync(path.join(__dirname, '..', 'filesystem', 'test-storage', 'test-project', 'test-project-1.0.0.tgz')))
        );
      });
  });

  it('should handle errors when packages are not available', function () {
    let req = new httpRequest();
    let res = new httpResponse();

    req.body._scope = "i-do-not-exist";
    req.body._packageName = "i-do-not-exist";
    req.body._requestedFile = "i-do-not-exist-1.0.0.tgz";
    route.process(req, res)
      .then(() => {
        expect(res.gotSend).to.equal("Package does not exist");
      });
  });

});