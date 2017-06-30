import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';

export default function (packagename, storageLocation) {
  return new Promise((resolve, reject) => {
    let packageLocation = path.join(storageLocation, packageName);

    if (!fs.existsSync(path.join(packageLocation, 'package.json'))) {
      reject("Invalid request, aborting");
    }

    rimraf(packageLocation, () => resolve(true));
  });
}