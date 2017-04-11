import fs from 'fs';
import config from './../../config';
import readJSON from './utils/read-json';
import writeJSON from './utils/write-json';

export default class {

  constructor() {
    this.response = {};
    this.success = false;
    this.storageLocation = config.storage.directory;
  }

  writePackage(packageName, packageVersion ,fileName, fileData, npmVersion, nodeVersion, npmUser) {
  //   let fileLocation = this.storageLocation + '/' + packageName + '/' + fileName;
  //   fs.writeFileSync(fileLocation, fileData);
  //
  //   let packageInfoLocation = this.storageLocation + '/' + packageName + '/package.json';
  //   let packageJSON = readJSON(packageInfoLocation);
  //
  //   let currentVersionInfo = packageJSON["versions"][packageJSON["dist-tags"]["latest"]];
  //
  //
  //   let newVersionObject = {
  //     packageVersion: {
  //       "name": currentVersionInfo['name'],
  //       "description": currentVersionInfo['description'],
  //       "main": currentVersionInfo['main'],
  //       "scripts": currentVersionInfo['scripts'],
  //     },
  //     "author": currentVersionInfo['author'],
  //     "license": currentVersionInfo['license'],
  //     "_id": currentVersionInfo['id'],
  //     "_shasum": "TODO", // TODO
  //     "_from": ".",
  //     "_npmVersion": npmVersion,
  //     "_nodeVersion": nodeVersion,
  //     "_npmUser": {}
  // }
  }

  getPackage(packageName, fileName) {
    let fileLocation = this.storageLocation + '/' + packageName + '/' + fileName;
    let fileData = fs.readFileSync(fileLocation);
    return fileData;
  }

  getPackageData(request) {

    let packageName = request.name;

    if (this.isPackageAvailable(packageName, this.storageLocation)) {
      let packageInfoLocation = this.storageLocation + '/' + packageName + '/package.json';
      let packageJSON = readJSON(packageInfoLocation);

      let whitelist = [ '_rev', 'name', 'versions', 'dist-tags', 'readme' ];
      for (let entry in packageJSON) {
        if (whitelist.indexOf(entry) === -1) {
          delete packageJSON[entry];
        }
      }

      this.success = true;
      return packageJSON;
    }
  }

  isSuccessFul() {
    let success = this.success;

    // reset successful
    this.success = false;
    return success;
  }


  // *** STORAGE VALIDATION ***

  doesFileExist(packageName, fileName) {
    return fs.existsSync(this.storageLocation + '/' + packageName + '/' + fileName);
  }

  // Checks if our storage has an entry for this packageName
  isPackageAvailable(packageName) {
    return fs.existsSync(this.storageLocation + '/' + packageName);
  }

  // Checks if a certain version of a package actually exists
  isVersionAvailable(packageName, packageVersion) {
    let packageInfoLocation = this.storageLocation + '/' + packageName + '/package.json';
    let packageJSON = readJSON(packageInfoLocation);

    let versionExists = packageJSON.hasAttribute(packageVersion);
    let fileExists = fs.existsSync(this.storageLocation, '/' + packageName + '/' + packageName + '-' + packageVersion + '.tgz');

    // Both have to be true for the version requested to be available
    return versionExists && fileExists;
  }

}