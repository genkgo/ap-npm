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
      this.storage.getPackageData({
        name: httpRequest.params.package,
        version: httpRequest.params.version,
      }).then((packageJson) => {

        let distTags = packageJson['dist-tags'];
        if (distTags) {
          httpResponse.send(JSON.stringify(distTags));
          resolve();
        } else {
          reject("404, could not get dist-tags")
        }
        
      });

    }).catch((err) => {
      httpResponse.send(err);
    })

  }
}

