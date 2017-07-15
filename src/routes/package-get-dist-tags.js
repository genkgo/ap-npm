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
      this.storage.getPackageJson({
        name: packageName,
        scope: packageScope
      }).catch(err => {
        httpResponse.status(404);
        httpResponse.send(err);
      })
        .then((packageJson) => {
          if (typeof packageJson === 'object') {
            let distTags = packageJson['dist-tags'];
            if (distTags) {
              resolve(httpResponse.send(distTags));
            }
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

