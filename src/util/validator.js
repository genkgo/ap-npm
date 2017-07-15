import semver from 'semver';

export default class {

  constructor(storage) {
    this.storage = storage;
  }

  /**
   * @param {Object} request {name: ?, scope: ?, version: ?}
   * @param {String} distTag dist-tag to check
   * @returns {Boolean} version is higher
   */
  isVersionHigher(request, distTag) {
    let packageName = request.name;
    let packageVersion = request.version;
    let packageScope = request.scope;

    return new Promise((resolve) => {
      this.storage.getPackageJson({
        name: packageName,
        scope: packageScope
      }).then((packageJson) => {
        let currentVersion = packageJson['dist-tags'][distTag];
        resolve(semver.satisfies(packageVersion, '>' + currentVersion));
      });
    });
  }

  /**
   * @param {Object} request {name: ?, scope: ?, version: ?}
   * @param {String} distTag dist-tag to check
   * @returns {Boolean} package has dist-tag
   */
  hasDistTag(request, distTag) {
    let packageName = request.name;
    let packageScope = request.scope;

    return new Promise((resolve) => {
      this.storage.getPackageJson({
        name: packageName,
        scope: packageScope
      }).then((packageJson) => {
        resolve(!!packageJson['dist-tags'][distTag]);
      });
    });
  }
}
