export default class {
  constructor() {
    this.body = {};
    this.url = "";
    this.originalUrl = "";
    this.statusCode = null;
    this.gotSend = null;
  }

  send(input) {
    this.gotSend = input;
  }

  status(code) {
    this.statusCode = code;
  }
}