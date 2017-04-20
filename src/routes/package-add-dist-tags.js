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
    let distTagVersion = httpRequest.body;

    let packageJson = this.storage.getPackageData({name: httpRequest.params.package});

    // Check if version exists
    if (typeof(packageJson['versions'][distTagVersion]) !== "object") {
      httpResponse.send("403, version does not exist");
      return;
    }

    packageJson['dist-tags'][distTag] = distTagVersion;

    try {
      if (this.storage.updatePackageJson(packageName, packageJson)) {
        httpResponse.status(200);
        httpResponse.send({
          ok: "dist-tags added"
        });
      }
    } catch (error) {
      httpResponse.send("404, could not get dist-tags");
    }
  }
}

