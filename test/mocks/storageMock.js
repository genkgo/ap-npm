import path from 'path';
import fs from 'fs';

export default class {
  constructor() {
    this.storageLocation = path.join(__dirname, '..', 'filesystem', 'test-storage');
  }

  getPackage(request) {
    return new Promise(resolve => {
      let name = request.name;
      let scope = request.scope;
      let file = request.file;
      let loc;
      if (scope) {
        loc = path.join(this.storageLocation, scope, name, file);
      } else {
        loc = path.join(this.storageLocation, name, file);
      }

      if (fs.existsSync(loc)) {
        fs.readFile(loc, (err, file) => {
          resolve(file);
        });
      } else {
        throw new Error("Package does not exist");
      }
    });
  }

  getPackageData(request) {
    return new Promise(resolve => {
      let name = request.name;
      let scope = request.scope;
      let unscoped = request.unscoped;
      let loc;

      if (scope) {
        loc = path.join(this.storageLocation, scope, name, 'package.json');
      } else {
        loc = path.join(this.storageLocation, name, 'package.json');
      }

      if (fs.existsSync(loc)) {
        fs.readFile(loc, (err, file) => {
          resolve(file);
        });
      } else {
        throw new Error("Package does not exist");
      }
    });
  }
}