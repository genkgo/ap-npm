export default class {
  constructor(config) {
    this.config = config;
  }

  process(httpRequest, httpResponse) {
    httpResponse.send(this.config);
  }
}