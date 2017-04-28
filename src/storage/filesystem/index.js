import fs from 'fs';
import rimraf from 'rimraf';
import semver from 'semver';
import config from './../../config';
import readJSON from './utils/read-json';
import writeJSON from './utils/write-json';

export default class {

  constructor() {
    this.storageLocation = config.storage.directory;

    try {
        if (!fs.existsSync(config.storage.directory)) {
            fs.mkdirSync(config.storage.directory, '0777', true);
        }
    } catch (err) {
      console.log("Could not create storage directory, ap-npm might malfunction\n", err.toString());
    }

  }

  removePackage(packageName) {
    let packageLocation = this.storageLocation + '/' + packageName;

    if (!fs.existsSync(packageLocation + '/package.json')) {
      throw new Error("Invalid request, aborting");
      return;
    }

    // location is valid
    rimraf.sync(packageLocation);
    return true;
  }

  removePackageVersion(packageName, packageVersion) {
    let packageLocation = this.storageLocation + '/' + packageName;
    let tarballLocation = packageLocation + '/' + packageName + '-' + packageVersion + '.tgz';

    if (!fs.existsSync(packageLocation + '/package.json')) {
      throw new Error("Invalid request, aborting");
      return;
    }

    // location is valid
    fs.unlinkSync(tarballLocation);
    let packageJson = this.getPackageJson(packageName);

    delete(packageJson.versions[packageVersion]);

    // If this was the last version of the package, we can remove it completely
    if (packageJson.versions.size === 0) {
      this.removePackage(packageName);
      return true;
    }

    if (packageJson['dist-tags']['latest'] === packageVersion) {
      // need to update dist-tags
      let highestVersion = '0.0.1';
      for (let key in packageJson.versions) {
        if (semver.satisfies(key, '>' + highestVersion)) {
          highestVersion = key;
        }
      }
      packageJson['dist-tags']['latest'] = highestVersion;
    }

    this.updatePackageJson(packageName, packageJson);
    return true;
  }

  // This is used for packages that don't exist in the storage yet
  writeNewPackage(packageData) {
    let fileName;
    for (let key in packageData._attachments) {
      fileName = key;
    }

    let folderPath = this.storageLocation + '/' + packageData.name;
    let filePath = folderPath + '/' + fileName;
    let packageJSONPath = folderPath + '/package.json';

    fs.mkdirSync(folderPath, '0777', true);
    fs.writeFileSync(filePath, Buffer.from(packageData._attachments[fileName]['data'], 'base64'), {'mode': '0777'});

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

    fs.writeFileSync(filePath, Buffer.from(packageData._attachments[fileName]['data'], 'base64'), {'mode': '0777'});
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

  getPackageJson(packageName) {
    let packageInfoLocation = this.storageLocation + '/' + packageName + '/package.json';
    return readJSON(packageInfoLocation);
  }


  /* Dist-tag functions*/
  updatePackageJson(packageName, packageJson) {
    let packageInfoLocation = this.storageLocation + '/' + packageName + '/package.json';
    writeJSON(packageInfoLocation, packageJson);
    return true;
  }
}