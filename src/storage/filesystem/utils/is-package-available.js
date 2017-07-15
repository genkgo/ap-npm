import path from 'path';
import fs from 'fs';

/**
 * @param {Object} request {name: ?, scope: ?} 
 * @param {String} storageLocation storage location
 * @return {Boolean} package is available
 */
export default function (request, storageLocation) {
  return new Promise((resolve) => {
    let packageName = request.name;
    let packageScope = request.scope;
    let packagePath;

    if (packageScope) {
      packagePath = path.join(storageLocation, packageScope, packageName, 'package.json');
    } else {
      packagePath = path.join(storageLocation, packageName, 'package.json');
    }

    resolve(fs.existsSync(packagePath));
  }).catch(() => {
    return false;
  });
}