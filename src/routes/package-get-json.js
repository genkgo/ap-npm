export default class {

  constructor(storage, proxy, proxyEnabled) {
    this.storage = storage;
    this.proxy = proxy;
    this.proxyEnabled = proxyEnabled;
  }

  process(httpRequest, httpResponse) {
    return new Promise((resolve, reject) => {
      return this.storage.getPackageJson({
        name: httpRequest.body._packageName,
        scope: httpRequest.body._scope
      }).catch((err) => {
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
            resolve(httpResponse.send(packageJson));
          } else {
            reject("package not found");
          }
        });
    }).catch((err) => {
        httpResponse.status(404);
        httpResponse.send(err);
      });
  }

}