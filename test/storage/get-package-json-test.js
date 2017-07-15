import path from 'path';
import fs from 'fs';
import md5 from 'md5';
import getPackageJson from '../../src/storage/filesystem/utils/get-package-json';

const expect = require('chai').expect;
const storageLocation = path.join(__dirname, '..', 'filesystem', 'test-storage');
const packageName = 'test-project';
const packageScope = '@apnpm';
const jsonLocation = path.join(__dirname, '..', 'filesystem', 'test-storage', packageName, 'package.json');
const jsonScopedLocation = path.join(__dirname, '..', 'filesystem', 'test-storage', packageScope, packageName, 'package.json');

describe('Storage getPackageJson', function () {

  it('should return package.json when package is available', function () {
    getPackageJson({name: packageName}, storageLocation)
      .then((json) => {
        fs.readFile(jsonLocation, 'utf-8', function (err, file) {
          if (err) {
            throw new Error("Storage getPackageJson test failed");
          }

          expect(md5(json)).to.equal(md5(JSON.parse(file)));
        });
      });
  });

  it('should return package.json when scoped package is available', function () {
    getPackageJson({name: packageName, scope: packageScope}, storageLocation)
      .then((json) => {
        fs.readFile(jsonScopedLocation, 'utf-8', function (err, file) {
          if (err) {
            throw new Error("Storage getPackageJson test failed");
          }

          expect(md5(json)).to.equal(md5(JSON.parse(file)));
        });
      });
  });

  it('should reject when package.json is not available', function () {
    getPackageJson({name: 'not-available'}, storageLocation)
      .catch((err) => {
        expect(err.toString()).to.equal("package.json does not exist");
      });
  });

  it('should reject when scoped package.json is not available', function () {
    getPackageJson({name: 'not-available', scope: 'undefined'}, storageLocation)
      .catch((err) => {
        expect(err.toString()).to.equal("package.json does not exist");
      });
  });
});