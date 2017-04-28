import semver from 'semver';

export default class {

  constructor(storage, validator, config) {
    this.storage = storage;
    this.packageValidator = validator;
    this.config = config;
  }

  /*
   * Reads package data from fileystem and sends it to npm-client
   */
  process(httpRequest, httpResponse) {
    return new Promise((resolve) => {
      if (this.config.auth.remove === false) {
        reject('403, not allowed to delete packages');
      }

      let packageName = httpRequest.params.package;
      let referer = httpRequest.headers.referer;
      let packageVersion;

      if (referer.indexOf('@') > -1) {
        let spliced = referer.split('@');
        packageVersion = spliced[spliced.length - 1];
      } else {
        let spliced = referer.split(' ');
        packageVersion = spliced[0];
      }

      if (packageVersion === 'unpublish') {
        this.storage.removePackage(packageName).then((result) => {
          if (result === true) {
            httpResponse.status(200).send({
              ok: "Package deleted"
            });
            resolve();
          } else {
            reject("424, cannot delete package from filesystem")
          }
        });
      }
      else if (semver.valid(packageVersion)) {
        this.storage.removePackageVersion(packageName, packageVersion).then((result) => {
          if (result === true) {
            httpResponse.status(200).send({
              ok: "Packageversion deleted"
            });
            resolve();
          } else {
            reject("424, cannot delete package from filesystem")
          }
        });
      }
    }).catch((err) => {
      httpResponse.send(err);
    });
  }
}

