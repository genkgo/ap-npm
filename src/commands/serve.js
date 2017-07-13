import httpolyglot from 'httpolyglot';
import fs from 'fs';


export default class {

  constructor(server, config) {
    this.app = server;
    this.port = config.port;
    this.ssl = config.ssl;
    this.config = config;
  }

  run() {
    if (this.ssl.enabled) {
      if (fs.existsSync(this.ssl.key) && fs.existsSync(this.ssl.cert)) {
        let key = fs.readFileSync(this.ssl.key);
        let cert = fs.readFileSync(this.ssl.cert);

        httpolyglot.createServer({
          key: key,
          cert: cert
        }, this.app).listen(this.port, '0.0.0.0', () => {
          console.log("ap-npm is listening on 0.0.0.0:" + this.port + '\n');
        });
      } else {
        this.config.ssl.enabled = false;
        console.log("ssl setup failed, key/cert files don't exist\n" +
          "ap-npm will run without being accessible using ssl\n");

        console.log("ap-npm is listening on http://0.0.0.0:" + this.port + '\n');
        this.app.listen(this.port);
      }
    } else {
      console.log("ap-npm is listening on http://0.0.0.0:" + this.port + '\n');
      this.app.listen(this.port);
    }
  }
}