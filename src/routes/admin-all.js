export default class {

  /**
   * @param {class} storage storage of ap-npm
   */
  constructor(storage) {
    this.storage = storage;
  }

  /**
   * @param {class} httpRequest req
   * @param {class} httpResponse res
   * @return {void} -
   */
  process(httpRequest, httpResponse) {
    this.storage.getPackageListing().then((listing) => {
      httpResponse.status(200);
      httpResponse.send(listing);
    });
  }

}