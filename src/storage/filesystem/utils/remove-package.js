import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';

export default function (request, storageLocation) {
  return new Promise((resolve, reject) => {
    let packageName = request.name;
    let packageScope = request.scope;
    let packageLocation;

    if (packageScope) {
      packageLocation = path.join(storageLocation, packageScope, packageName);
    } else {
      packageLocation = path.join(storageLocation, packageName);
    }

    if (!fs.existsSync(path.join(packageLocation, 'package.json'))) {
      reject("Invalid request, aborting");
    }

    rimraf(packageLocation, () => resolve(true));
  });
}