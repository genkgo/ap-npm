import httpolyglot from 'httpolyglot';
import fs from 'fs';


export default class {

  /**
   * @param {express} server Express app
   * @param {Object} config config for ap-npm
   */
  constructor(server, config, logger) {
    this.app = server;
    this.port = config.port;
    this.ssl = config.ssl;
    this.hostname = config.hostname;
    this.config = config;
    this.logger = logger;
  }

  run() {
    if (this.ssl.enabled) {
      if (fs.existsSync(this.ssl.key) && fs.existsSync(this.ssl.cert)) {
        let key = fs.readFileSync(this.ssl.key);
        let cert = fs.readFileSync(this.ssl.cert);

        httpolyglot.createServer({
          key: key,
          cert: cert
        }, this.app).listen(this.port, this.hostname, () => {
          this.logger.info("ap-npm is listening on " + this.hostname + ":" + this.port + '\n');
        });
      } else {
        this.config.ssl.enabled = false;
        this.logger.warn("ssl setup failed, key/cert files don't exist\n" +
          "ap-npm will run without being accessible using ssl\n");

        this.logger.info("ap-npm is listening on http://" + this.hostname + ":" + this.port + '\n');
        this.app.listen(this.port);
      }
    } else {
      this.logger.info("ap-npm is listening on http://" + this.hostname + ":" + this.port + '\n');
      this.app.listen(this.port);
    }
  }
}