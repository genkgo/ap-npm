import semver from 'semver';

export default class {

  constructor(storage, validator, config) {
    this.storage = storage;
    this.packageValidator = validator;
    this.config = config;
  }

  /**
   * @param {class} httpRequest req
   * @param {class} httpResponse res
   * @return {void} -
   */
  process(httpRequest, httpResponse) {
    return new Promise((resolve, reject) => {
      if (this.config.auth.remove === false) {
        reject('403, not allowed to delete packages');
      }

      let packageName = httpRequest.body._packageName;
      let packageScope = httpRequest.body._scope;
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
        this.storage.removePackage({
          name: packageName,
          scope: packageScope
        }).then((result) => {
          if (result === true) {
            httpResponse.status(200);
            resolve(httpResponse.send({
              ok: "Package deleted"
            }));
          } else {
            reject("424, cannot delete package from filesystem");
          }
        });
      } else if (semver.valid(packageVersion)) {
        this.storage.removePackageVersion({
          name: packageName,
          scope: packageScope,
          version: packageVersion
        }).then((result) => {
          if (result === true) {
            httpResponse.status(200);
            resolve(httpResponse.send({
              ok: "Packageversion deleted"
            }));
          } else {
            reject("424, cannot delete package from filesystem");
          }
        });
      }
    }).catch((err) => {
      httpResponse.send(err);
    });
  }
}