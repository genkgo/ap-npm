import path from 'path';
import fs from 'fs';
import fse from 'fs-extra';
import readJSON from './read-json';
import writeJSON from './write-json';

/**
 * @param {Object} request {name: ?, scope: ?}
 * @param {Object} packageData package.json data
 * @param {String} storageLocation storage location
 * @param {Class} logger logger class for ap-npm
 * @return {Promise|Boolean} package written
 */
export default function (request, packageData, storageLocation, logger) {
  return new Promise((resolve) => {
    let attachmentName;
    let packageName = request.name;
    let packageScope = request.scope;
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
      .then((packageJson) => {
        packageJson.versions[newVersion] = packageData.versions[newVersion];

        let distTags = packageJson['dist-tags'];
        let newDistTags = packageData['dist-tags'];

        for (let key in newDistTags) distTags[key] = newDistTags[key];

        packageJson['dist-tags'] = distTags;

        fs.writeFile(
          filePath,
          Buffer.from(packageData._attachments[attachmentName].data, 'base64'),
          {'mode': '0777'},
          () => {
            writeJSON(packageInfoLocation, packageJson)
              .then((result) => {
                if (packageScope) {
                  logger.info("Published new package: " + packageScope + '/' + packageName);
                } else {
                  logger.info("Published new package: " + packageName);
                }
                resolve(result);
              });
          });
      });
  });
}