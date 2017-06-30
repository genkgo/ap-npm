import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';

import removePackage from './utils/remove-package';
import removePackageVersion from './utils/remove-package-version';
import getPackage from './utils/get-package';
import getPackageData from './utils/get-package-data';
import isPackageAvailable from './utils/is-package-available';
import isVersionAvailable from './utils/is-version-available';
import getPackageJson from './utils/get-packagejson';
import updatePackageJson from './utils/update-packagejson';
import writePackage from './utils/write-package';
import writeNewPackage from './utils/write-new-package';

export default class {

  constructor(config) {
    this.config = config;
    this.storageLocation = path.join(this.config.workDir, this.config.storage.directory);

    try {
      if (!fs.existsSync(this.storageLocation)) { mkdirp.sync(this.storageLocation); }
    } catch (err) {
      console.log("Could not create storage directory, ap-npm might malfunction\n", err.toString());
    }
  }

  removePackage(packageName) {
    return removePackage(packageName, this.storageLocation);
  }

  removePackageVersion(packageName, packageVersion) {
    return removePackageVersion(
      packageName,
      packageVersion,
      this.getPackageJson,
      this.updatePackageJson,
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

  getPackageData(request) {
    return getPackageData(request, this.storageLocation);
  }

  isPackageAvailable(packageName, packageScope = null) {
    return isPackageAvailable(packageName, this.storageLocation, packageScope);
  }

  isVersionAvailable(request, packageVersion) {
    return isVersionAvailable(request, packageVersion, this.storageLocation);
  }

  getPackageJson(packageName, packageScope = null) {
    return getPackageJson(packageName, this.storageLocation, packageScope);
  }

  updatePackageJson(packageData) {
    return updatePackageJson(packageData, this.storageLocation);
  }
}