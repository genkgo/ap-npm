import path from 'path';
import fs from 'fs';

export default function (request, storageLocation) {
  let packageName = request.name;
  let packageScope = request.scope;
  let fileName = request.file;

  return new Promise((resolve, reject) => {
    let fileLocation;

    if (packageScope) {
      fileLocation = path.join(storageLocation, packageScope, packageName, fileName);
    } else {
      fileLocation = path.join(storageLocation, packageName, fileName);
    }

    fs.readFile(fileLocation, (err, file) => {
      resolve(file);
    });
  });
}