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

    let packageName = httpRequest.params.package;
    let distTag = httpRequest.params.tag;

    let packageJson = this.storage.getPackageData({
      name: httpRequest.params.package,
      version: httpRequest.params.version,
    });

    delete(packageJson['dist-tags'][distTag]);

    try {
      if (this.storage.updatePackageJson(packageName, packageJson)) {
        httpResponse.status(200);
        httpResponse.send({
          ok: "dist-tags updated"
        });
      }
    } catch (error) {
      httpResponse.send("404, could not get dist-tags");
    }
  }
}

