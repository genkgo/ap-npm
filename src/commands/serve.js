import httpolyglot from 'httpolyglot';
import fs from 'fs';
import path from 'path';


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
            if (
                fs.existsSync(path.normalize(this.ssl.key)) &&
                fs.existsSync(path.normalize(this.ssl.cert))
            ) {
                this.startSslServer(
                    path.join(path.normalize(this.ssl.key)),
                    path.join(path.normalize(this.ssl.cert))
                );
            } else if (
                fs.existsSync(path.join(this.config.workDir, this.ssl.key)) &&
                fs.existsSync(path.join(this.config.workDir, this.ssl.cert))
            ) {
                this.startSslServer(
                    path.join(this.config.workDir, this.ssl.key),
                    path.join(this.config.workDir, this.ssl.cert)
                );
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

    startSslServer(sslKey, sslCert) {
        let key = fs.readFileSync(sslKey);
        let cert = fs.readFileSync(sslCert);

        httpolyglot.createServer({
            key: key,
            cert: cert
        }, this.app).listen(this.port, this.hostname, () => {
            this.logger.info("ap-npm is listening on " + this.hostname + ":" + this.port + '\n');
        });
    }
}