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

export default class {

  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
    this.storageLocation = path.join(this.config.workDir, this.config.storage.directory);
  }

  /**
   * @param request
   */
  removePackage(request) {
    return removePackage(request, this.storageLocation);
  }

  /**
   * @param request
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
   * @param request
   * @param packageData
   */
  writeNewPackage(request, packageData) {
    return writeNewPackage(request, packageData, this.storageLocation);
  }

  /**
   * @param request
   * @param packageData
   */
  writePackage(request, packageData) {
    return writePackage(request, packageData, this.storageLocation);
  }

  /**
   * @param request
   */
  getPackage(request) {
    return getPackage(request, this.storageLocation);
  }

  /**
   * @param request
   */
  getPackageJson(request) {
    return getPackageJson(request, this.storageLocation);
  }

  /**
   * @param request
   */
  isPackageAvailable(request) {
    return isPackageAvailable(request, this.storageLocation);
  }

  /**
   * @param request
   */
  isVersionAvailable(request) {
    return isVersionAvailable(request, this.storageLocation);
  }

  /**
   * @param request
   * @param packageJson
   */
  updatePackageJson(request, packageJson) {
    return updatePackageJson(request, packageJson, this.storageLocation);
  }
}