import semver from 'semver';
import config from '../config';

export default class {

  constructor(storage, validator) {
    this.storage = storage;
    this.packageValidator = validator;
  }

  /*
   * Reads package data from fileystem and sends it to npm-client
   */
  process(httpRequest, httpResponse) {
    if (config.auth.remove === false) {
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
          return;
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
          return;
        }
      } catch(err) {
        httpResponse.send("424, cannot delete package from filesystem");
      }
    }
  }
}

