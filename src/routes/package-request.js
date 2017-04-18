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

    let result = this.storage.isSuccessFul();

    if (result) {
      let response = JSON.stringify(packageJson);
      httpResponse.send(response);
    } else {

      // Package not found
      httpResponse.sendStatus(404);
    }
  }

}