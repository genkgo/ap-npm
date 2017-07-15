import path from 'path';
import isVersionAvailable from '../../src/storage/filesystem/utils/is-version-available';

const expect = require('chai').expect;
const storageLocation = path.join(__dirname, '..', 'filesystem', 'test-storage');
const packageName = 'test-project';
const packageScope = '@apnpm';
const packageVersion = '1.0.0';
const unavailablePackage = 'unavailable';
const unavailableVersion = '2.0.0';

describe('Storage isVersionAvailable', function () {

  it('should return true when package version is available', function () {
    isVersionAvailable({name: packageName, version: packageVersion}, storageLocation)
      .then((result) => {
        expect(result).to.equal(true);
      });
  });

  it('should return false when package version is unavailable', function () {
    isVersionAvailable({name: packageName, version: unavailableVersion}, storageLocation)
      .then((result) => {
        expect(result).to.equal(false);
      });
  });

  it('should return true when scoped package version is available', function () {
    isVersionAvailable({name: packageName, scope: packageScope, version: packageVersion}, storageLocation)
      .then((result) => {
        expect(result).to.equal(true);
      });
  });

  it('should return false when scoped package version is unavailable', function () {
    isVersionAvailable({name: packageName, scope: packageScope, version: unavailableVersion}, storageLocation)
      .then((result) => {
        expect(result).to.equal(false);
      });
  });

  it('should return false when package is unavailable', function () {
    isVersionAvailable({name: unavailablePackage, version: unavailableVersion}, storageLocation)
      .then((result) => {
        expect(result).to.equal(false);
      });
  });

  it('should return false when scoped package is unavailable', function () {
    isVersionAvailable({name: unavailablePackage, scope: packageScope, version: unavailableVersion}, storageLocation)
      .then((result) => {
        expect(result).to.equal(false);
      });
  });

});