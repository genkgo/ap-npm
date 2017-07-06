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
   * @param {object} request
   * @param {string} request.name - The name of the package
   * @param {string} request.scope - The scope of the package
   */
  removePackage(request) {
    return removePackage(request, this.storageLocation);
  }

  /**
   * @param {object} request
   * @param {string} request.name - The name of the package
   * @param {string} request.scope - The scope of the package
   * @param {string} request.version - The version of the package
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
   * @param {object} request
   * @param {string} request.name - The name of the package
   * @param {string} request.scope - The scope of the package
   * @param {string} request.file - The file to be written
   * @param {object} packageData - The package.json
   */
  writeNewPackage(request, packageData) {
    return writeNewPackage(request, packageData, this.storageLocation);
  }

  /**
   * @param {object} request
   * @param {string} request.name - The name of the package
   * @param {string} request.scope - The scope of the package
   * @param {string} request.file - The file to be written
   * @param {object} packageData - The package.json
   */
  writePackage(request, packageData) {
    return writePackage(request, packageData, this.storageLocation);
  }

  /**
   * @param {object} request
   * @param {string} request.name - The name of the package
   * @param {string} request.scope - The scope of the package
   * @return {buffer}
   */
  getPackage(request) {
    return getPackage(request, this.storageLocation);
  }

  /**
   * @param {object} request
   * @param {string} request.name - The name of the package
   * @param {string} request.scope - The scope of the package
   * @return {object}
   */
  getPackageJson(request) {
    return getPackageJson(request, this.storageLocation);
  }

  /**
   * @param {object} request
   * @param {string} request.name - The name of the package
   * @param {string} request.scope - The scope of the package
   * @return {Boolean}
   */
  isPackageAvailable(request) {
    return isPackageAvailable(request, this.storageLocation);
  }

  /**
   * @param {object} request
   * @param {string} request.name - The name of the package
   * @param {string} request.scope - The scope of the package
   * @param {string} request.version - The version of the package
   * @return {Boolean}
   */
  isVersionAvailable(request) {
    return isVersionAvailable(request, this.storageLocation);
  }

  /**
   * @param {object} request
   * @param {string} request.name - The name of the package
   * @param {string} request.scope - The scope of the package
   * @param packageJson
   */
  updatePackageJson(request, packageJson) {
    return updatePackageJson(request, packageJson, this.storageLocation);
  }

  /**
   * @returns {object}
   */
  getPackageListing() {
    return getPackageListing(this.storageLocation);
  }
}