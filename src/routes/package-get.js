export default class {

  constructor(storage, validator) {
    this.storage = storage;
    this.packageValidator = validator;
  }

  process(httpRequest, httpResponse) {
    let packageName = httpRequest['params']['package'];
    let fileName = httpRequest['params']['filename'];
    console.log(packageName, fileName);
    let fileData = this.storage.getPackage(packageName, fileName);

    httpResponse.send(fileData);
  }
}

