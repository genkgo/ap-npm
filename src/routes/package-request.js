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
            this.storage.getPackageData({
                name: httpRequest.params.package,
                version: httpRequest.params.version,
            }).catch((err) => reject(err))
                .then((packageJson) => {
                    if (typeof packageJson === 'object') {
                        httpResponse.send(packageJson);
                        resolve();
                    } else {
                        reject("404, package not found");
                    }
                });
        }).catch((err) => {
            if (this.proxyEnabled) {
                this.proxy.process(httpRequest, httpResponse);
            } else {
                httpResponse.status(404);
                httpResponse.send(err);
            }
        });
    }
}