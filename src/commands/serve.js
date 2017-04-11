export default class {

  constructor(server, port) {
    this.server = server;
    this.port = port;
  }

  run() {
    this.server.listen(this.port);
  }

}
