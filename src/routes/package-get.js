export default class {

  constructor(storage, validator) {
    this.storage = storage;
    this.packageValidator = validator;
  }

  /*
  * Reads package data from fileystem and sends it to npm-client
  */
  process(httpRequest, httpResponse) {
    return new Promise((resolve) => {
      let packageName = httpRequest['params']['package'];
      let fileName = httpRequest['params']['filename'];
      this.storage.getPackage(packageName, fileName).then((data) => {
        httpResponse.send(data);
        resolve();
      });
    });
  }
}

