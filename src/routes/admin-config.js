export default class {
  constructor(config) {
    this.config = config;
  }

  /**
   * @param {class} httpRequest req
   * @param {class} httpResponse res
   * @return {void} -
   */
  process(httpRequest, httpResponse) {
    httpResponse.send(this.config);
  }
}