import path from 'path';
import fs from 'fs';

/**
 * @param {Object} request {name: ?, scope: ?, file: ?}
 * @param {String} storageLocation storage Location
 * @return {Buffer} filedata of package
 */
export default function (request, storageLocation) {
  let packageName = request.name;
  let packageScope = request.scope;
  let fileName = request.file;

  return new Promise((resolve) => {
    let fileLocation;

    if (packageScope) {
      fileLocation = path.join(storageLocation, packageScope, packageName, fileName);
    } else {
      fileLocation = path.join(storageLocation, packageName, fileName);
    }

    resolve(fs.readFileSync(fileLocation));
  });
}