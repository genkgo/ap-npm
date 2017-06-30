import fs from 'fs';
import child_process from 'child_process';
import path from 'path';


export default class {

  constructor(hostname, port, ssl) {
    this.hostname = hostname;
    this.port = port;
    this.ssl = ssl;
  }

  run(pathToProject) {
    let spawn = child_process.spawnSync;
    let shell = (cmd, opts) => {
      process.stdin.pause();
      return spawn(cmd, opts, {
        stdio: [0, 1, 2]
      });
    };

    shell('npm', ['init']);

    fs.readFile(path.join(pathToProject, 'package.json'), (err, packageString) => {
      let publishConfig;
      if (err !== null) {
        console.log(err);
        return;
      }

      if (this.ssl) {
        publishConfig = {
          "registry": "https://" + this.hostname + ':' + this.port
        };
      } else {
        publishConfig = {
          "registry": "http://" + this.hostname + ':' + this.port
        };
      }


      console.log('\nUpdating package.json with publishConfig:', publishConfig);

      let packageJson = JSON.parse(packageString);
      packageJson.publishConfig = publishConfig;

      fs.writeFile(path.join(pathToProject, 'package.json'), JSON.stringify(packageJson, null, 2), {'mode': '0664'}, () => {
        console.log("ap-npm project created in: " + pathToProject + '\n');
      });

    });
  }

}
