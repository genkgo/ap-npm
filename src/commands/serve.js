import https from 'https';
import fs from 'fs';


export default class {

  constructor(server, port, ssl) {
    this.app = server;
    this.port = port;
    this.ssl = ssl;
  }

  run() {
    if (this.ssl.enabled) {
      if (fs.existsSync(this.ssl.key) && fs.existsSync(this.ssl.cert)) {
        let key = fs.readFileSync(this.ssl.key);
        let cert = fs.readFileSync(this.ssl.cert);

        console.log("ap-npm is listening on https://localhost:" + this.port + '\n');
        https.createServer({
          key: key,
          cert: cert
        }, this.app).listen(this.port);
      } else {
        console.log("ssl verification failed, key/cert files don't exist\n" +
          "ap-npm will run without using ssl\n");
        console.log("ap-npm is listening on http://localhost:" + this.port + '\n');
        this.app.listen(this.port);

      }
    }

    else {
      this.app.listen(this.port);
    }
  }

}
