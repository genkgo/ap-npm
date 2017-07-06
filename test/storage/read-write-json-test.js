import writeJson from '../../src/storage/filesystem/utils/write-json';
import readJson from '../../src/storage/filesystem/utils/read-json';
import path from 'path';
import fs from 'fs';
import fse from 'fs-extra';
import md5 from 'md5';

const expect = require('chai').expect;
const jsonLocation = path.join(__dirname, '..', 'filesystem', 'test-storage', 'test-project', 'package.json');
const tmpLocation = path.join(__dirname, '..', 'filesystem', 'tmp');
const jsonCopyLocation = path.join(tmpLocation, 'package.json');
const object = JSON.parse(fs.readFileSync(jsonLocation));

if (!fs.existsSync(path.join(__dirname, '..', 'filesystem', 'tmp'))) {
  fse.mkdirsSync(path.join(__dirname, '..', 'filesystem', 'tmp'));
}

describe("JSON Reader", function () {

  it("parses a json file to object", function () {

    readJson(jsonLocation)
      .then(json=> {
        expect(md5(json)).to.equal(md5(object));
      });
  });

});

describe("JSON Writer", function () {

  it("writes an object to a json file", function () {
    writeJson(jsonCopyLocation, object)
      .then(() => {
        fs.readFile(jsonCopyLocation, 'utf-8', function (err, data) {
          if (err) {
            throw new Error("file was not written, " + err.toString());
          }

          expect(md5(data)).to.equal(md5(object));
          fse.removeSync(tmp)
        });
      });
  });

});