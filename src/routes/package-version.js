import PackageNotFoundException from '../exception/package-not-found';

export default class {

  constructor(packageVersioner, storage) {
    this.packageVersioner = packageVersioner;
    this.storage = storage;
  }

  process(httpRequest, httpResponse) {
    let packageVersionRequest = this.packageVersioner.fromHttpRequest(httpRequest);
    let result = this.storage.getPackage(packageVersionRequest);
    if (result.isSuccessful()) {
      let packageVersionResponse = result.getResponse();
      this.packageVersioner.toHttpResponse(packageVersionResponse, httpResponse);
    } else {
      httpResponse.setStatus(404);
    }
  }

}