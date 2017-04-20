import semver from 'semver';

export default class {

  constructor(storage) {
    this.storage = storage;
  }

  // *** GET ***

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

  isVersionHigher(packageName, packageVersion, distTag) {
    // Check if version that we got is higher than what is available
    let packageData = this.storage.getPackageJson(packageName);
    let currentVersion = packageData['dist-tags'][distTag];
    return semver.satisfies(packageVersion, '>' + currentVersion);
  }

  hasDistTag(packageName, distTag) {
    let packageData = this.storage.getPackageJson(packageName);
    if (!!packageData['dist-tags'][distTag]) {
      return true;
    } else {
      return false;
    }
  }
}
