import path from 'path';
import fs from 'fs';
import md5 from 'md5';
import getPackage from '../../src/storage/filesystem/utils/get-package';

const expect = require('chai').expect;
const storageLocation = path.join(__dirname, '..', 'filesystem', 'test-storage');
const packageName = 'test-project';
const packageScope = '@apnpm';
const fileName = 'test-project-1.0.0.tgz';
const packageLocation = path.join(storageLocation, packageName, fileName);
const packageScopedLocation = path.join(storageLocation, packageScope, packageName, fileName);

describe('Storage getPackage', function () {

  it('should return packageData when package is available', function () {
    getPackage({
      name: packageName,
      scope: null,
      file: fileName
    }, storageLocation)
      .then((data) => {
        fs.readFile(packageLocation, function (err, file) {
          if (err) {
            throw new Error("Storage getPackage failed");
          }
          expect(md5(data)).to.equal(md5(file));
        });
      });
  });

  it('should return packageData when package is available', function () {
    getPackage({
      name: packageName,
      scope: packageScope,
      file: fileName
    }, storageLocation)
      .then((data) => {
        fs.readFile(packageScopedLocation, function (err, file) {
          if (err) {
            throw new Error("Storage getPackage failed");
          }
          expect(md5(data)).to.equal(md5(file));
        });
      });
  });

  it('should throw an error when package is unavailable', function () {
    getPackage({
      name: 'undefined',
      scope: null,
      file: fileName
    }, storageLocation)
      .catch((err) => {
        expect(err.errno).to.equal(-2);
      });
  });

});