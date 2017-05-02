export default class {

  constructor(storage, validator) {
    this.storage = storage;
    this.packageValidator = validator;
  }

  /*
  * Reads package data from fileystem and sends it to npm-client
  */
  process(httpRequest, httpResponse) {
    return new Promise((resolve, reject) => {
      let packageName = httpRequest['params']['package'];
      let fileName = httpRequest['params']['filename'];
      this.storage.getPackage(packageName, fileName)
        .catch((err) => reject(err))
        .then((data) => {
        httpResponse.send(data);
        resolve();
      }).catch((err) => {
        httpResponse.send(err.toString());
      });
    });
  }
}

