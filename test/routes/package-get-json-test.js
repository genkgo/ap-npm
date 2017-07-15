import packageJson from '../../src/routes/package-get-json';
import StorageMock from '../mocks/storageMock';
import proxyMock from '../mocks/proxyMock';
import httpRequest from '../mocks/httpRequestMock';
import httpResponse from '../mocks/httpResponseMock';
import fs from 'fs';
import path from 'path';
import md5 from 'md5';

const expect = require('chai').expect;
const storage = new StorageMock();

describe('Route package-json', function () {
  it('should get package.json', function () {
    let req = new httpRequest();
    let res = new httpResponse();
    let proxy = new proxyMock();
    let route = new packageJson(storage, proxy, false);

    req.body._scope = null;
    req.body._packageName = "test-project";
    req.body._scopedName = "test-project";

    route.process(req, res).then(() => {
      expect(res.statusCode).to.equal(200);
      expect(md5(res.gotSend)).to.equal(
        md5(fs.readFileSync(path.join(__dirname, '..', 'filesystem', 'test-storage', 'test-project', 'package.json')))
      );
      expect(proxy.gotCalled).to.equal(false);
    });
  });

  it('should handle errors when package.json is not available', function () {
    let req = new httpRequest();
    let res = new httpResponse();
    let proxy = new proxyMock();
    let route = new packageJson(storage, proxy, false);

    req.body._scope = null;
    req.body._packageName = "i-do-not-exist";
    req.body._scopedName = "i-do-not-exist";

    route.process(req, res).then(() => {
      expect(res.statusCode).to.equal(404);
      expect(proxy.gotCalled).to.equal(false);
    });
  });

  it('should return local package even when proxy is enabled', function () {
    let req = new httpRequest();
    let res = new httpResponse();
    let proxy = new proxyMock();
    let route = new packageJson(storage, proxy, true);

    req.body._scope = null;
    req.body._packageName = "test-project";
    req.body._scopedName = "test-project";

    route.process(req, res).then(() => {
      expect(res.statusCode).to.equal(200);
      expect(md5(res.gotSend)).to.equal(
        md5(fs.readFileSync(path.join(__dirname, '..', 'filesystem', 'test-storage', 'test-project', 'package.json')))
      );
      expect(proxy.gotCalled).to.equal(false);
    });
  });

  it('should call proxy when enabled', function () {
    let req = new httpRequest();
    let res = new httpResponse();
    let proxy = new proxyMock();
    let route = new packageJson(storage, proxy, true);

    req.body._scope = null;
    req.body._packageName = "i-do-not-exist";
    req.body._scopedName = "i-do-not-exist";

    route.process(req, res).then(() => {
      expect(proxy.gotCalled).to.equal(true);
    });
  });

});