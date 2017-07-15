import packageGetTag from '../../src/routes/package-get-dist-tags';
import StorageMock from '../mocks/storageMock';
import httpRequest from '../mocks/httpRequestMock';
import httpResponse from '../mocks/httpResponseMock';
import fs from 'fs';
import path from 'path';
import md5 from 'md5';

const expect = require('chai').expect;
const storage = new StorageMock();

describe('Route package-get-dist-tag', function () {
  it('should get dist-tags', function () {
    let req = new httpRequest();
    let res = new httpResponse();
    let route = new packageGetTag(storage);

    req.body._scope = null;
    req.body._packageName = "test-project";
    req.body._scopedName = "test-project";

    route.process(req, res).then(() => {
      expect(res.statusCode).to.equal(200);
      fs.readFile(
        path.join(__dirname, '..', 'filesystem', 'test-storage', 'test-project', 'package.json'),
        (err, file) => {
          let packageJson = JSON.parse(file);
          expect(md5(res.gotSend)).to.equal(packageJson["dist-tags"]);
        });
    });
  });

  it('should get scoped dist-tags', function () {
    let req = new httpRequest();
    let res = new httpResponse();
    let route = new packageGetTag(storage);

    req.body._scope = "@apnpm";
    req.body._packageName = "test-project";
    req.body._scopedName = "test-project";

    route.process(req, res).then(() => {
      expect(res.statusCode).to.equal(200);
      fs.readFile(
        path.join(__dirname, '..', 'filesystem', 'test-storage', '@apnpm', 'test-project', 'package.json'),
        (err, file) => {
          let packageJson = JSON.parse(file);
          expect(md5(res.gotSend)).to.equal(packageJson["dist-tags"]);
        });
    });
  });

  it('should handle errors when package.json is not available', function () {
    let req = new httpRequest();
    let res = new httpResponse();
    let route = new packageGetTag(storage);

    req.body._scope = null;
    req.body._packageName = "i-do-not-exist";
    req.body._scopedName = "i-do-not-exist";

    route.process(req, res).then(() => {
      expect(res.statusCode).to.equal(404);
    });
  });
});