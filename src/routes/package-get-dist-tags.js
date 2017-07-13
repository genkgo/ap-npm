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
      this.storage.getPackageJson({
        name: httpRequest.params.package
      }).then((packageJson) => {
        let distTags = packageJson['dist-tags'];
        if (distTags) {
          resolve(httpResponse.send(distTags));
        } else {
          reject("404, could not get dist-tags");
        }
      });

    }).catch((err) => {
      httpResponse.status(404);
      httpResponse.send(err);
    });
  }
}

