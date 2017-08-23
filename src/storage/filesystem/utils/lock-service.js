import path from 'path';
import fs from 'fs';

export default class {
  constructor(config, storageLocation) {
    this.config = config;
    this.storageLocation = storageLocation;
  }

  isLocked(request) {
    return new Promise((resolve, reject) => {
      let name = request.name;
      let scope = request.scope;
      let packageLocation = path.join(this.storageLocation, scope, name);

      if (fs.existsSync(path.join(packageLocation, 'lockfile'))) {
        reject('file is locked');
      }
      resolve(false);
    });
  }

  lock(request) {
    return new Promise((resolve, reject) => {
      let name = request.name;
      let scope = request.scope;
      let packageLocation = path.join(this.storageLocation, scope, name);

      if (fs.existsSync(path.join(packageLocation, 'lockfile'))) {
        reject('file is already locked');
      }

      fs.writeFileSync(path.join(packageLocation, 'lockfile'), '');
      resolve(true);
    })
  }

  unlock(request) {
    return new Promise((resolve, reject) => {
      let name = request.name;
      let scope = request.scope;
      let packageLocation = path.join(this.storageLocation, scope, name);

      if (fs.existsSync(path.join(packageLocation, 'lockfile'))) {
        reject('file is not locked');
      }

      fs.unlinkSync(path.join(packageLocation, 'lockfile'));
      resolve();
    });
  }
}