import path from 'path';
import writeJSON from './write-json';

export default function (packageData, storageLocation) {
    let packageName = packageData._packageName;
    let packageScope = packageData._scope;

    return new Promise((resolve) => {
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