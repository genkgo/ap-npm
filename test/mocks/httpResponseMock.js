export default class {
  constructor() {
    this.body = {};
    this.url = "";
    this.originalUrl = "";
    this.statusCode = null;
    this.gotSend = null;
  }

  send(input) {
    return new Promise(() => {
      this.gotSend = input;
    });
  }

  status(code) {
    return new Promise(() => {
      this.statusCode = code;
    });
  }
}