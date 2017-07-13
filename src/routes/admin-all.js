export default class {
  /**
   * @param {class} storage
   * @param {class} auth
   */
  constructor(storage, auth) {
    this.storage = storage;
    this.auth = auth;
  }

  /**
   * @param {class} httpRequest
   * @param {class} httpResponse
   */
  process(httpRequest, httpResponse) {
    this.storage.getPackageListing().then((listing) => {
      httpResponse.status(200);
      httpResponse.send(listing);
    });
  }

}