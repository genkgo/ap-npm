import path from 'path';
import fs from 'fs';

export default function (request, storageLocation) {
  let packageName = request.name;
  let packageScope = request.scope;
  return new Promise((resolve) => {
    let packagePath;
    if (packageScope) {
      packagePath = path.join(storageLocation, packageScope, packageName, 'package.json');
    } else {
      packagePath = path.join(storageLocation, packageName, 'package.json');
    }

    if (fs.existsSync(packagePath)) {
      resolve(true);
    }
    resolve(false);
  }).catch(() => {
    return false;
  });
}