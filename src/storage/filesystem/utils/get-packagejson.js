import path from 'path';
import readJSON from './read-json';

export default function (packageName, storageLocation, packageScope = null) {
    return new Promise((resolve) => {
      let packageInfoLocation;
      if (packageScope) {
        packageInfoLocation = path.join(storageLocation, packageScope, packageName, 'package.json');
      } else {
        packageInfoLocation = path.join(storageLocation, packageName, 'package.json');
      }

      readJSON(packageInfoLocation)
        .then((data) => resolve(data));
    });
}