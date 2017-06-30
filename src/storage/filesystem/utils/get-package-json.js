import path from 'path';
import readJSON from './read-json';

export default function (request, storageLocation) {
  return new Promise((resolve, reject) => {
    let packageName = request.name;
    let packageScope = request.scope;

    let jsonPath;
    if (packageScope) {
      jsonPath = path.join(storageLocation, packageScope, packageName, 'package.json');
    } else {
      jsonPath = path.join(storageLocation, packageName, 'package.json');
    }

    if (fs.existsSync(jsonPath)) {
      readJSON(jsonPath)
        .then((data) => {
          resolve(data);
        });
    } else {
      reject("Could not get package.json");
    }
  });
}