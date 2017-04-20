export default class {

  constructor(storage) {
    this.storage = storage;
  }

  /*
  * Reads the package.json data from filesystem and sends it to the npm-client
  * */
  process(httpRequest, httpResponse) {
    let packageJson;
    try {
        packageJson = this.storage.getPackageData({
            name: httpRequest.params.package,
            version: httpRequest.params.version,
        });
    } catch (err) {
      httpResponse.send("404, package not found");
      return;
    }

    httpResponse.send(JSON.stringify(packageJson));
  }

}