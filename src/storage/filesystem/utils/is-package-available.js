import path from 'path';
import fs from 'fs';

export default function (packageName, storageLocation, packageScope = null) {
  return new Promise((resolve) => {
    let packagePath;
    if (packageScope) {
      packagePath = path.join(storageLocation, packageScope, packageName, 'package.json');
    } else {
      packagePath = path.join(storageLocation, packageName, 'package.json');
    }

    if (fs.existsSync(packagePath)) {
      resolve(true);
    }
    resolve(false);
  }).catch((err) => {
    console.log("Err: package not available: " +
      packageName +
      "\n" + err
    );
    return false;
  });
}