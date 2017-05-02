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
      }).catch((err) => reject(err))
        .then((packageJson) => {

        if (typeof packageJson === 'object') {
          httpResponse.send(packageJson);
          resolve();
        } else {
          reject("404, package not found")
        }
      });
    }).catch((err) => {
      httpResponse.send(err.toString());
    })
  }
}