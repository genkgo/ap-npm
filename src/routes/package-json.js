export default class {

  constructor(storage, proxy, proxyEnabled) {
    this.storage = storage;
    this.proxy = proxy;
    this.proxyEnabled = proxyEnabled;
  }

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
            reject(err);
          }
        })
        .then((packageJson) => {
          if (typeof packageJson === 'object') {
            httpResponse.status(200);
            httpResponse.send(packageJson);
            resolve();
          } else {
            reject("package not found");
          }
        });
    })
      .catch((err) => {
        httpResponse.status(404);
        httpResponse.send(err);
      });
  }

}