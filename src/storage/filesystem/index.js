import fs from 'fs';
import fse from 'fs-extra';
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

  constructor(config) {
    this.config = config;
    this.storageLocation = path.join(this.config.workDir, this.config.storage.directory);

    try {
      if (!fs.existsSync(this.storageLocation)) { fse.mkdirsSync(this.storageLocation); }
    } catch (err) {
      console.log("Could not create storage directory, ap-npm might malfunction\n", err.toString());
    }
  }

  removePackage(packageName) {
    return removePackage(packageName, this.storageLocation);
  }

  removePackageVersion(packageName, packageScope, packageVersion) {
    return removePackageVersion(
      packageName,
      packageScope,
      packageVersion,
      this.getPackageJson,
      updatePackageJson,
      this.removePackage,
      this.storageLocation
    );
  }

  writeNewPackage(packageData) {
    return writeNewPackage(packageData, this.storageLocation);
  }

  writePackage(packageData) {
    return writePackage(packageData, this.storageLocation);
  }

  getPackage(request) {
    return getPackage(request, this.storageLocation);
  }

  getPackageJson(request) {
    return getPackageJson(request, this.storageLocation);
  }

  isPackageAvailable(packageName, packageScope = null) {
    return isPackageAvailable(packageName, this.storageLocation, packageScope);
  }

  isVersionAvailable(request, packageVersion) {
    return isVersionAvailable(request, packageVersion, this.storageLocation);
  }
}