export default class {

  constructor(storage, validator) {
    this.storage = storage;
    this.packageValidator = validator;
  }

  process(httpRequest, httpResponse) {
    // console.log(httpRequest);

    let packageName = httpRequest.params.package;



    if (this.storage.isPackageAvailable(packageName)) {
      // Package exists so we need to check for a valid new version
    } else {
      // Package doesn't exist, need to verify if it's a valid package then publish to storage

    }
  }

}