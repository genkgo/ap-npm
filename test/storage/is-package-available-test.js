import path from 'path';
import isPackageAvailable from '../../src/storage/filesystem/utils/is-package-available';

const expect = require('chai').expect;
const storageLocation = path.join(__dirname, '..', 'filesystem', 'test-storage');
const packageName = 'test-project';
const packageScope = '@apnpm';

describe('Storage isPackageAvailable', function () {

  it('should return true when package is available', function () {
    isPackageAvailable({name: packageName}, storageLocation).then((result) => {
      expect(result).to.equal(true);
    });
  });

  it('should return false when package is not available', function () {
    isPackageAvailable({name: 'not-available'}, storageLocation).then((result) => {
      expect(result).to.equal(false);
    });
  });

  it('should return true when scoped package is available', function () {
    isPackageAvailable({name: packageName, scope: packageScope}, storageLocation).then((result) => {
      expect(result).to.equal(true);
    });
  });

  it('should return false when scoped package is not available', function () {
    isPackageAvailable({name: 'not-available', scope: packageScope}, storageLocation).then((result) => {
      expect(result).to.equal(false);
    });
  });
});