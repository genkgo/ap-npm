import path from 'path';
import writeJSON from './write-json';

export default function (request, packageJson, storageLocation) {
    return new Promise((resolve) => {
      let packageName = request.name;
      let packageScope = request.scope;
      let packageInfoLocation;
      if (packageScope) {
        packageInfoLocation = path.join(storageLocation, packageScope, packageName, 'package.json');
      } else {
        packageInfoLocation = path.join(storageLocation, packageName, 'package.json');
      }

      writeJSON(packageInfoLocation, packageJson)
        .then((result) => resolve(result));
    });
}