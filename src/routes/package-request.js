export default class {

  constructor(storage) {
    this.storage = storage;
  }

  /*
  * Reads the package.json data from filesystem and sends it to the npm-client
  * */
  process(httpRequest, httpResponse) {
    return new Promise((resolve, reject) => {
      this.storage.getPackageData({
        name: httpRequest.params.package,
        version: httpRequest.params.version,
      }).then((packageJson) => {
        if (packageJson) {
          httpResponse.send(JSON.stringify(packageJson));
          resolve();
        } else {
          reject("404, package not found")
        }
      });
    }).catch((err) => {
      httpResponse.send(err);
    })
  }
}