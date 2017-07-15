import path from 'path';
import fs from 'fs';
import fse from 'fs-extra';
import writeJSON from './write-json';

/**
 * @param {Object} request {name: ?, scope: ?}
 * @param {Object} packageData package.json data
 * @param {String} storageLocation storage location
 * @return {Boolean} package written
 */
export default function (request, packageData, storageLocation) {
  return new Promise((resolve) => {
      let packageName = request.name;
      let packageScope = request.scope;
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

      fse.mkdirsSync(folderPath);
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