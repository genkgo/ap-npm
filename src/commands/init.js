import fs from 'fs';
import child_process from 'child_process';
import path from 'path';


export default class {

  /**
   * @param {Object} config config for ap-npm
   * @param {Logger} logger Logger class
   */
  constructor(config, logger) {
    this.host = config.hostname;
    this.port = config.port;
    this.ssl = config.ssl.enabled;
    this.logger = logger;
  }

  run(pathToProject) {
    return new Promise((resolve) => {
      let spawn = child_process.spawnSync;
      let shell = (cmd, opts) => {
        process.stdin.pause();
        return spawn(cmd, opts, {
          stdio: [0, 1, 2]
        });
      };
      resolve(shell('npm', ['init']));
    }).then(() => {
      fs.readFile(path.join(pathToProject, 'package.json'), (err, file) => {
        let publishConfig;
        if (err !== null) {
          this.logger.warn(err);
          return;
        }

        if (this.ssl) {
          publishConfig = {
            "registry": "https://" + this.host + ':' + this.port
          };
        } else {
          publishConfig = {
            "registry": "http://" + this.host + ':' + this.port
          };
        }
        this.logger.info('\nUpdating package.json with publishConfig:', publishConfig);
        let packageJson = JSON.parse(file);
        packageJson.publishConfig = publishConfig;
        fs.writeFile(path.join(pathToProject, 'package.json'), JSON.stringify(packageJson, null, 2), { 'mode': '0664' }, () => {
          this.logger.info("ap-npm project created in: " + pathToProject + '\n');
        });
      });
    });
  }

}
