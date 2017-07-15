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

      this.storage.getPackageJson({
        name: packageName,
        scope: packageScope
      }).catch(err => {
        httpResponse.status(404);
        httpResponse.send(err);
      })
        .then((packageJson) => {
          if (typeof packageJson === 'object') {
            delete(packageJson['dist-tags'][distTag]);
            this.storage.updatePackageJson({
              name: packageName,
              scope: packageScope
            }, packageJson)
              .then((result) => {
                if (result === true) {
                  httpResponse.status(200);
                  resolve(httpResponse.send({
                    ok: "dist-tags updated"
                  }));
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