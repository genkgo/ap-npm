import fs from 'fs';
import config from './../../config';
import readJSON from './utils/read-json';
import writeJSON from './utils/write-json';

export default class {

  constructor() {
    this.storageLocation = config.storage.directory;
  }

  // This is used for packages that don't exist in the storage yet
  writeNewPackage(packageData) {
    let fileName;
    let versionInfo = packageData.versions[packageData['dist-tags']['latest']];
    for (let key in packageData._attachments) {
      fileName = key;
    }

    let folderPath = this.storageLocation + '/' + packageData.name;
    let filePath = folderPath + '/' + fileName;
    let packageJSONPath = folderPath + '/package.json';

    fs.mkdirSync(folderPath);
    fs.writeFileSync(filePath, Buffer.from(packageData._attachments[fileName]['data'], 'base64'));

    let packageJSON = packageData;
    delete packageJSON['_attachments'];
    writeJSON(packageJSONPath, packageJSON);

    console.log("Wrote new package to filesystem:", {
      "filePath": filePath,
      "packageJSON": packageJSONPath
    });
  }

  // This is used for packages that have been published before -> adding a new version
  writePackage(packageData) {
    let fileName;
    let packageInfoLocation = this.storageLocation + '/' + packageData.name + '/package.json';
    let versionInfo = packageData.versions[packageData['dist-tags']['latest']];
    let folderPath = this.storageLocation + '/' + packageData.name;
    let packageJSONPath = folderPath + '/package.json';

    for (let key in packageData._attachments) {
      fileName = key;
    }
    let filePath = folderPath + '/' + fileName;

    let newVersion;
    for (let key in packageData.versions) {
      newVersion = key;
    }

    let packageJSON = readJSON(packageInfoLocation);
    packageJSON.versions[newVersion] = packageData.versions[newVersion];

    let distTags = packageJSON['dist-tags'];
    let newDistTags = packageData['dist-tags'];

    // Merge dist-tags, we need to preserve old dist-tags
    for (let key in newDistTags) {
      distTags[key] = newDistTags[key];
    }

    packageJSON['dist-tags'] = distTags;

    fs.writeFileSync(filePath, Buffer.from(packageData._attachments[fileName]['data'], 'base64'));
    writeJSON(packageInfoLocation, packageJSON);

    console.log("Wrote package to filesystem:", {
      "filePath": filePath,
      "packageJSON": packageJSONPath
    });
  }

  getPackage(packageName, fileName) {
    let fileLocation = this.storageLocation + '/' + packageName + '/' + fileName;
    return fs.readFileSync(fileLocation);
  }

  getPackageData(request) {

    let packageName = request.name;

    if (this.isPackageAvailable(packageName, this.storageLocation)) {
      let packageInfoLocation = this.storageLocation + '/' + packageName + '/package.json';
      let packageJSON = readJSON(packageInfoLocation);

      return packageJSON;
    } else {
      throw new Error("Could not get packageData");
    }
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

    let versionExists = false;

    for (let version in packageJSON['versions']) {
      if (version === packageVersion){
        versionExists = true;
      }
    }
    let fileExists = fs.existsSync(this.storageLocation, '/' + packageName + '/' + packageName + '-' + packageVersion + '.tgz');

    // Both have to be true for the version requested to be available
    return versionExists && fileExists;
  }

  getAvailableVersions(packageName) {
    let packageInfoLocation = this.storageLocation + '/' + packageName + '/package.json';
    let packageJSON = readJSON(packageInfoLocation);

    return packageJSON['versions'];
  }

  getLatestVersion(packageName) {
    let packageInfoLocation = this.storageLocation + '/' + packageName + '/package.json';
    let packageJSON = readJSON(packageInfoLocation);

    return packageJSON['dist-tags']['latest'];
  }

  getPackageJson(packageName) {
    let packageInfoLocation = this.storageLocation + '/' + packageName + '/package.json';
    return readJSON(packageInfoLocation);
  }
}