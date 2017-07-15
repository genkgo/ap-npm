import path from 'path';

import removePackage from './utils/remove-package';
import removePackageVersion from './utils/remove-package-version';
import getPackage from './utils/get-package';
import getPackageJson from './utils/get-package-json';
import isPackageAvailable from './utils/is-package-available';
import isVersionAvailable from './utils/is-version-available';
import updatePackageJson from './utils/update-packagejson';
import writePackage from './utils/write-package';
import writeNewPackage from './utils/write-new-package';
import getPackageListing from './utils/get-package-listing';

export default class {

  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
    this.storageLocation = path.join(this.config.workDir, this.config.storage.directory);
  }

  /**
   * @param {object} request {name: ?, scope: ?}
   * @return {Boolean} package removed
   */
  removePackage(request) {
    return removePackage(request, this.storageLocation);
  }

  /**
   * @param {object} request {name: ?, scope: ?, version: ?}
   * @return {Boolean} package version removed
   */
  removePackageVersion(request) {
    return removePackageVersion(
      request,
      this.getPackageJson,
      this.updatePackageJson,
      this.removePackage,
      this.storageLocation
    );
  }

  /**
   * @param {object} request {name: ?, scope: ?, file: ?}
   * @param {object} packageData - The package.json
   * @return {Boolean} new package written
   */
  writeNewPackage(request, packageData) {
    return writeNewPackage(request, packageData, this.storageLocation, this.logger);
  }

  /**
   * @param {object} request {name: ?, scope: ?, file: ?}
   * @param {object} packageData - The package.json
   * @return {Boolean} package written
   */
  writePackage(request, packageData) {
    return writePackage(request, packageData, this.storageLocation, this.logger);
  }

  /**
   * @param {object} request {name: ?, scope: ?}
   * @return {buffer} package file buffer
   */
  getPackage(request) {
    return getPackage(request, this.storageLocation);
  }

  /**
   * @param {object} request {name: ?, scope: ?}
   * @return {object} package.json object
   */
  getPackageJson(request) {
    return getPackageJson(request, this.storageLocation);
  }

  /**
   * @param {object} request {name: ?, scope: ?}
   * @return {Boolean} isPackageAvailable
   */
  isPackageAvailable(request) {
    return isPackageAvailable(request, this.storageLocation);
  }

  /**
   * @param {object} request {name: ?, scope: ?, version: ?}
   * @return {Boolean} isVersionAvailable
   */
  isVersionAvailable(request) {
    return isVersionAvailable(request, this.storageLocation);
  }

  /**
   * @param {object} request {name: ?, scope: ?}
   * @param {object} packageJson package.json to update with
   * @return {Boolean} package.json updated
   */
  updatePackageJson(request, packageJson) {
    return updatePackageJson(request, packageJson, this.storageLocation);
  }

  /**
   * @returns {object} listing of available packages
   */
  getPackageListing() {
    return getPackageListing(this.storageLocation);
  }
}