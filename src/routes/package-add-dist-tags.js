export default class {

  constructor(storage) {
    this.storage = storage;
  }

  /**
   * @param {class} httpRequest req
   * @param {class} httpResponse res
   * @return {void} -
   */
  process(httpRequest, httpResponse) {
    return new Promise((resolve, reject) => {
      let packageName = httpRequest.body._packageName;
      let packageScope = httpRequest.body._scope;
      let distTag = httpRequest.body._disttag;
      let distTagVersion = httpRequest.body['npm-args'];

      this.storage.getPackageJson({
        name: packageName,
        scope: packageScope
      }).catch(err => {
        httpResponse.status(404);
        httpResponse.send(err);
      })
        .then((packageJson) => {
        if (typeof(packageJson) === 'object') {
          if (typeof(packageJson.versions[distTagVersion]) !== "object") {
            reject("Version does not exist");
          }

          packageJson['dist-tags'][distTag] = distTagVersion;

          this.storage.updatePackageJson({
              name: packageName,
              scope: packageScope
            },
            packageJson)
            .then((result) => {
              if (result === true) {
                httpResponse.status(200);
                httpResponse.send({
                  ok: "dist-tags added"
                });
                resolve();
              } else {
                reject("Could not get dist-tags");
              }
            });
        } else {
          reject("Could not get dist-tags");
        }
      });
    }).catch((err) => {
      httpResponse.status(404);
      httpResponse.send(err);
    });
  }
}

