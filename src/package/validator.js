import semver from 'semver';

export default class {

  constructor(storage) {
    this.storage = storage;
  }

  // *** GET ***

  doesFileExist(packageName, fileName) {
    return this.storage.doesFileExist(packageName, fileName);
  }

  doesPackageExist(packageName) {
    return this.storage.isPackageAvailable(packageName);
  }

  doesVersionExist(packageName, packageVersion) {
    return this.storage.isVersionAvailable(packageName, packageVersion);
  }

  // *** PUBLISHING ***

  isNameValid(packageName) {
    let exists = this.storage.isPackageAvailable(packageName);
  }

  isVersionHigher(packageName, packageVersion) {
    // Check if version that we got is higher than what is available
    let currentVersion = this.storage.getLatestVersion(packageName);
    return semver.satisfies(packageVersion, '>' + currentVersion);
  }
}
