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
    let packageJson = this.storage.getPackageData({
      name: httpRequest.params.package,
      version: httpRequest.params.version,
    });

    let distTags = packageJson['dist-tags'];

    httpResponse.send(distTags);
  }
}

