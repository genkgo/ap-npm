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

  isVersionValid(packageName, packageVersion) {
    let exists = this.storage.isVersionAvailable(packageName, packageVersion);
  }
}
