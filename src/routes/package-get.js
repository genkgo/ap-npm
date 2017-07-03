export default class {

  constructor(storage) {
    this.storage = storage;
  }

  /*
   * Reads package data from fileystem and sends it to npm-client
   */
  process(httpRequest, httpResponse) {
    return new Promise((resolve) => {
      let packageName = httpRequest.body._packageName;
      let packageScope = httpRequest.body._scope;
      let fileName = httpRequest.body._requestedFile;

      this.storage.getPackage({
        name: packageName,
        scope: packageScope,
        file: fileName
      })
        .then((data) => {
          httpResponse.status(200);
          httpResponse.send(data);
          resolve();
        })
        .catch((err) => {
          httpResponse.status(404);
          httpResponse.send({
            message: err
          });
        });
    });
  }
}

