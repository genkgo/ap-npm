import semver from 'semver';

export default class {

  constructor(storage) {
    this.storage = storage;
  }

  doesVersionExist(packageName, packageVersion, packageScope = null) {
    return new Promise((resolve) => {
      this.storage.isVersionAvailable(packageName, packageVersion, packageScope).then((result) => {
        resolve(result);
      });
    });
  }

  // *** PUBLISHING ***
  isVersionHigher(packageName, packageScope = null, packageVersion, distTag) {
    return new Promise((resolve) => {
      this.storage.getPackageJson({
        name: packageName,
        scope: packageScope
      }).then((packageData) => {
        let currentVersion = packageData['dist-tags'][distTag];
        resolve(semver.satisfies(packageVersion, '>' + currentVersion));
      })
    });
  }

  hasDistTag(packageData, distTag) {
    let packageName = packageData._packageName;
    let packageScope = packageData._scope;

    return new Promise((resolve) => {
      this.storage.getPackageJson(packageName, packageScope).then((packageJson) => {
        resolve(!!packageJson['dist-tags'][distTag]);
      });
    });
  }
}
