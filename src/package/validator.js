import semver from 'semver';

export default class {

  constructor(storage) {
    this.storage = storage;
  }

  // *** GET ***
  doesPackageExist(packageName) {
    return new Promise((resolve) => {
      this.storage.isPackageAvailable(packageName).then((result) => {
        resolve(result);
      });
    });
  }

  doesVersionExist(packageName, packageVersion, packageScope = null) {
    return new Promise((resolve) => {
      this.storage.isVersionAvailable(packageName, packageVersion, packageScope).then((result) => {
        resolve(result);
      });
    });
  }

  // *** PUBLISHING ***
  isVersionHigher(packageName, packageVersion, distTag) {
    // Check if version that we got is higher than what is available
    return new Promise((resolve) => {
      this.storage.getPackageJson(packageName).then((packageData) => {
        let currentVersion = packageData['dist-tags'][distTag];
        resolve(semver.satisfies(packageVersion, '>' + currentVersion));
      })
    });
  }

  hasDistTag(packageName, distTag) {
    return new Promise((resolve) => {
      this.storage.getPackageJson(packageName).then((packageData) => {
        resolve(!!packageData['dist-tags'][distTag]);
      });
    });
  }
}
