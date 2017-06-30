export default class {

  constructor(storage, proxy, proxyEnabled) {
    this.storage = storage;
    this.proxy = proxy;
    this.proxyEnabled = proxyEnabled;
  }

  /*
   * Reads the package.json data from filesystem and sends it to the npm-client
   * */
  process(httpRequest, httpResponse) {
    return new Promise((resolve, reject) => {
      return this.storage.getPackageData({
        name: httpRequest.body._packageName,
        scope: httpRequest.body._scope,
        unscoped: httpRequest.body._scopedName
      })
        .catch((err) => {
          if (this.proxyEnabled) {
            this.proxy.process(httpRequest, httpResponse)
              .then(resolve());
          } else {
            console.log("Err: Proxy disabled, rejecting: " + httpRequest.body._packageName);
            reject(err);
          }
        })
        .then((packageJson) => {
          if (typeof packageJson === 'object') {
            httpResponse.send(packageJson);
            resolve();
          } else {
            reject("package not found");
          }
        });
    })
      .catch((err) => {
        console.log("Err: 404, " + err);
        httpResponse.status(404);
        httpResponse.send(err);
      });
  }
}