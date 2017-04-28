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
    if (this.config.auth.remove === false) {
      httpResponse.send('403, not allowed to delete packages');
      return;
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
      try {
        if (this.storage.removePackage(packageName)) {
          httpResponse.status(200).send({
            ok: "Package deleted"
          });
        }
      } catch(err) {
        httpResponse.send("424, cannot delete package from filesystem");
      }
    }
    else if (semver.valid(packageVersion)) {
      try {
        if (this.storage.removePackageVersion(packageName, packageVersion)) {
          httpResponse.status(200).send({
            ok: "Packageversion deleted"
          });
        }
      } catch(err) {
        httpResponse.send("424, cannot delete package from filesystem");
      }
    }
  }
}

