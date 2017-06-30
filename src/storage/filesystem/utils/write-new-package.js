import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';
import writeJSON from './write-json';

export default function (packageData, storageLocation) {
  return new Promise((resolve) => {
      let packageName = packageData._packageName;
      let packageScope = packageData._scope;
      let attachmentName;
      let folderPath;
      let packageJsonPath;
      let filePath;
      for (let key in packageData._attachments) {
        attachmentName = key;
      }

      if (packageScope) {
        folderPath = path.join(storageLocation, packageScope, packageName);
        filePath = path.join(folderPath, attachmentName.substr(packageScope.length + 1));
      } else {
        folderPath = path.join(storageLocation, packageName);
        filePath = path.join(folderPath, attachmentName);
      }

      mkdirp.sync(folderPath);
      packageJsonPath = path.join(folderPath, 'package.json');

      fs.writeFileSync(filePath, Buffer.from(packageData._attachments[attachmentName].data, 'base64'), { 'mode': '0777' });
      let packageJSON = packageData;
      delete packageJSON._attachments;

      writeJSON(packageJsonPath, packageJSON).then((result) => {
        console.log("Wrote new package to filesystem:", {
          "filePath": filePath,
          "packageJSON": packageJsonPath
        });
        resolve(result);
      });
    });
}