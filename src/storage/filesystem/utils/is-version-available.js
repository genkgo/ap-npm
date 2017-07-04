import path from 'path';
import fs from 'fs';
import readJSON from './read-json';

export default function (request, packageVersion, storageLocation) {
    let packageName = request._packageName;
    let packageScope = request._scope;

    return new Promise((resolve) => {
      let packageInfoLocation;
      if (packageScope) {
        packageInfoLocation = path.join(storageLocation, packageScope, packageName, 'package.json');
      } else {
        packageInfoLocation = path.join(storageLocation, packageName, 'package.json');
      }

      readJSON(packageInfoLocation)
        .then((packageJSON) => {
          let versionExists = false;
          let fileName;

          for (let version in packageJSON.versions) {
            if (version === packageVersion) {
              versionExists = true;
            }
          }

          if (packageScope) {
            fileName = packageName.substr(packageScope.length + 1);
          } else {
            fileName = packageName;
          }

          let fileExists;
          if (packageScope) {
            fileExists = fs.existsSync(path.join(storageLocation, packageScope, packageName, packageName + '-' + packageVersion + '.tgz'));
          } else {
            fileExists = fs.existsSync(path.join(storageLocation, packageName, fileName + '-' + packageVersion + '.tgz'));
          }

          // Both have to be true for the version requested to be available
          resolve(versionExists && fileExists);
        });
    }).catch((err) => {
      return false;
    });
}