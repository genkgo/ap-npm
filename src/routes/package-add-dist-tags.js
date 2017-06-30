export default class {

  constructor(storage, validator) {
    this.storage = storage;
    this.packageValidator = validator;
  }

  /*
   * Reads dist-tags and sends them to npm-client
   * *** hasn't been tested yet***
   */
  process(httpRequest, httpResponse) {
    return new Promise((resolve, reject) => {
      let packageName = httpRequest.params.package;
      let distTag = httpRequest.params.tag;
      let distTagVersion = httpRequest.body;

      this.storage.getPackageData({name: httpRequest.params.package})
        .catch((err) => reject(err))
        .then((packageJson) => {
        if (typeof(packageJson.versions[distTagVersion]) !== "object") {
          reject("403, version does not exist");
        }

        packageJson['dist-tags'][distTag] = distTagVersion;

        this.storage.updatePackageJson(packageName, packageJson).then((result) => {
          if (result === true) {
            httpResponse.status(200);
            httpResponse.send({
              ok: "dist-tags added"
            });
            resolve();
          } else {
            reject("404, could not get dist-tags");
          }
        });
      });
    }).catch((err) => {
      httpResponse.send(err);
    });
  }
}

