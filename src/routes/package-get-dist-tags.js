export default class {

  constructor(storage, validator) {
    this.storage = storage;
    this.packageValidator = validator;
  }

  process(httpRequest, httpResponse) {
    let packageJson = this.storage.getPackageData({
      name: httpRequest.params.package,
      version: httpRequest.params.version,
    });

    let distTags = packageJson['dist-tags'];

    httpResponse.send(JSON.stringify(distTags));
  }
}

