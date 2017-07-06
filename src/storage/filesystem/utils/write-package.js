import path from 'path';
import fs from 'fs';
import fse from 'fs-extra';
import readJSON from './read-json';
import writeJSON from './write-json';

export default function (packageData, storageLocation) {
  return new Promise((resolve) => {
    let attachmentName;
    let packageName = packageData._packageName;
    let packageScope = packageData._scope;
    let packageInfoLocation;
    let folderPath;

    if (packageScope) {
      packageInfoLocation = path.join(storageLocation, packageScope, packageName, 'package.json');
      folderPath = path.join(storageLocation, packageScope, packageName);
    } else {
      packageInfoLocation = path.join(storageLocation, packageName, 'package.json');
      folderPath = path.join(storageLocation, packageName);
    }

    fse.mkdirsSync(folderPath);
    for (let key in packageData._attachments) {
      attachmentName = key;
    }

    let newVersion;
    for (let key in packageData.versions) {
      newVersion = key;
    }

    let filePath = folderPath + '/' + packageName + '-' + newVersion + '.tgz';

    readJSON(packageInfoLocation)
      .then((packageJSON) => {
        packageJSON.versions[newVersion] = packageData.versions[newVersion];

        let distTags = packageJSON['dist-tags'];
        let newDistTags = packageData['dist-tags'];

        // Merge dist-tags, we need to preserve old dist-tags
        for (let key in newDistTags) {
          distTags[key] = newDistTags[key];
        }

        packageJSON['dist-tags'] = distTags;

        console.log(attachmentName);
        fs.writeFile(
          filePath,
          Buffer.from(packageData._attachments[attachmentName].data, 'base64'),
          {'mode': '0777'},
          () => {
            writeJSON(packageInfoLocation, packageJSON)
              .then((result) => {
                console.log("Wrote package to filesystem:", {
                  "filePath": filePath,
                  "packageJSON": packageInfoLocation
                });
                resolve(result);
              });
          });
      });
  });
}