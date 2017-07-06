import fs from 'fs';
import path from 'path';

let getVersions = function (packageLocation) {
  let versionArray = [];
  let packageJson = JSON.parse(fs.readFileSync(path.join(packageLocation, 'package.json')));

  let versions = packageJson.versions;
  for (let key in versions) {
    if (versions.hasOwnProperty(key)) {
      versionArray.push(key);
    }
  }
  return versionArray;
};


export default function (storageLocation) {
  return new Promise((resolve) => {
    let storageListing = {};

    fs.readdirSync(storageLocation).forEach((part) => {
      if (part.indexOf('@') !== -1) {
        if (!storageListing.hasOwnProperty(part)) {
          storageListing[part] = {};
        }

        fs.readdirSync(path.join(storageLocation, part)).forEach((scopedPart) => {
          let scopedLocation = path.join(storageLocation, part, scopedPart);

          if (fs.lstatSync(scopedLocation).isDirectory()) {
            if (!storageListing[part].hasOwnProperty(scopedPart)) {
              storageListing[part][scopedPart] = {};
            }

            storageListing[part][scopedPart] = getVersions(scopedLocation);
          }
        });
      } else {
        let location = path.join(storageLocation, part);
        storageListing[part] = getVersions(location);
      }
    });

    resolve(storageListing);
  });
}