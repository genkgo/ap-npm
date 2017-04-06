export default class {

  constructor(server) {
    this.server = server;
  }

  run() {
    this.server.listen();
  }

}
