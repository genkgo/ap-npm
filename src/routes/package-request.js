export default class {

  constructor(storage) {
    this.storage = storage;
  }

  /*
  * Reads the package.json data from filesystem and sends it to the npm-client
  * */
  process(httpRequest, httpResponse) {
    let packageJson = this.storage.getPackageData({
      name: httpRequest.params.package,
      version: httpRequest.params.version,
    });

    if (packageJson) {
      let response = JSON.stringify(packageJson);
      httpResponse.send(response);
    } else {
      // Package not found
      httpResponse.send("404, package not found");
    }
  }

}