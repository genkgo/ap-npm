import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import semver from 'semver';
import readJSON from './utils/read-json';
import writeJSON from './utils/write-json';
import mkdirp from 'mkdirp';

export default class {

  constructor(config) {
    this.config = config;

    this.storageLocation = path.join(this.config.workDir, this.config.storage.directory);

    try {
      if (!fs.existsSync(this.storageLocation)) {
        mkdirp.sync(this.storageLocation);
      }
    } catch (err) {
      console.log("Could not create storage directory, ap-npm might malfunction\n", err.toString());
    }

  }

  removePackage(packageName) {
    return new Promise((resolve, reject) => {
      let packageLocation = path.join(this.storageLocation, packageName);

      if (!fs.existsSync(packageLocation + '/package.json')) {
        reject("Invalid request, aborting");
      }

      // location is valid
      rimraf(packageLocation, () => {
        resolve(true);
      });
    }).catch((err) => {
      throw new Error(err);
    });
  }

  removePackageVersion(packageName, packageVersion) {
    return new Promise((resolve, reject) => {
      let packageLocation = this.storageLocation + '/' + packageName;
      let tarballLocation = packageLocation + '/' + packageName + '-' + packageVersion + '.tgz';

      fs.exists(packageLocation + '/package.json', (exists) => {
        if (!exists) {
          reject("Invalid request, aborting");
        }

        // location is valid
        fs.unlink(tarballLocation, () => {
          let packageJson = this.getPackageJson(packageName);

          delete (packageJson.versions[packageVersion]);

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
          this.updatePackageJson(packageName, packageJson)
            .then((result) => {
              resolve(result);
            });
        });
      });
    }).catch((err) => {
      throw new Error(err);
    })
  }

  // This is used for packages that don't exist in the storage yet
  writeNewPackage(packageData) {
    return new Promise((resolve) => {
      let fileName;
      let attachmentName;
      for (let key in packageData._attachments) {
        if (packageData._scope) {
          fileName = key.substr(packageData._scope.length + 1);
        } else {
          fileName = key;
        }
        attachmentName = key;
      }

      let folderPath = this.storageLocation + '/' + packageData.name;
      let filePath = folderPath + '/' + fileName;
      console.log(filePath);
      let packageJsonPath = folderPath + '/package.json';


      mkdirp(folderPath);
      fs.writeFileSync(filePath, Buffer.from(packageData._attachments[attachmentName].data, 'base64'), {'mode': '0777'});
      let packageJSON = packageData;
      delete packageJSON._attachments;

      writeJSON(packageJsonPath, packageJSON).then((result) => {
        console.log("Wrote new package to filesystem:", {
          "filePath": filePath,
          "packageJSON": packageJsonPath
        });
        resolve(result);
      });
    }).catch((err) => {
      throw new Error(err);
    })
  }

  // This is used for packages that have been published before -> adding a new version
  writePackage(packageData) {
    return new Promise((resolve) => {
      let fileName;
      let attachmentName;
      let packageName = packageData._packageName;
      let packageScope = packageData._scope;
      let packageInfoLocation;
      let folderPath;

      if (packageScope) {
        packageInfoLocation = path.join(this.storageLocation, packageScope, packageName, 'package.json');
        folderPath = path.join(this.storageLocation, packageScope, packageData.name);
      } else {
        packageInfoLocation = path.join(this.storageLocation, packageName, 'package.json');
        folderPath = path.join(this.storageLocation, packageData.name);
      }

      // console.log(packageData);

      for (let key in packageData._attachments) {
        attachmentName = key;
      }

      let newVersion;
      for (let key in packageData.versions) {
        newVersion = key;
      }

      let filePath = folderPath + '/' + fileName + '-' + newVersion + '.tgz';

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
    }).catch((err) => {
      throw new Error(err);
    });
  }

  getPackage(request) {
    let packageName = request.name;
    let packageScope = request.scope;
    let fileName = request.file;

    return new Promise((resolve, reject) => {
      let fileLocation;

      if (packageScope) {
        fileLocation = path.join(this.storageLocation, packageScope, packageName, fileName);
      } else {
        fileLocation = path.join(this.storageLocation, packageName, fileName);
      }

      fs.readFile(fileLocation, (err, file) => {
        if (err) {
          console.log("Err: file does not exist " + fileName);
          reject(err);
        }
        resolve(file);
      });
    });
  }

  getPackageData(request) {
    return new Promise((resolve, reject) => {
      let packageName = request.name;
      let packageScope = request.scope;

      let jsonPath;
      if (packageScope) {
        jsonPath = path.join(this.storageLocation, packageScope, packageName, 'package.json');
      } else {
        jsonPath = path.join(this.storageLocation, packageName, 'package.json');
      }

      if (fs.existsSync(jsonPath)) {
        readJSON(jsonPath)
          .then((data) => {
            resolve(data);
          });
      } else {
        reject("Could not get package.json");
      }
    });
  }

  // *** STORAGE VALIDATION ***
  // Checks if our storage has an entry for this packageName
  isPackageAvailable(packageName, packageScope = null) {
    return new Promise((resolve) => {
      let packagePath;
      if (packageScope) {
        packagePath = path.join(this.storageLocation, packageScope, packageName, 'package.json');
      } else {
        packagePath = path.join(this.storageLocation, packageName, 'package.json');
      }

      if (fs.existsSync(packagePath)) {
        resolve(true);
      }
      resolve(false);
    }).catch((err) => {
      console.log("Package not available: " + packageName);
      return false;
    });
  }

  // Checks if a certain version of a package actually exists
  isVersionAvailable(request, packageVersion) {
    let packageName = request._packageName;
    let packageScope = request._scope;
    let scopedName = request._scopedName;

    return new Promise((resolve) => {
      let packageInfoLocation;
      if (packageScope) {
        packageInfoLocation = path.join(this.storageLocation, packageScope, packageName, 'package.json');
      } else {
        packageInfoLocation = path.join(this.storageLocation, packageName, 'package.json');
      }

      readJSON(packageInfoLocation)
        .then((packageJSON) => {
          let versionExists = false;
          let fileName;

          for (let version in packageJSON.versions) {
            if (version === packageVersion) {
              versionExists = true;
            }
          }

          if (packageScope) {
            fileName = packageName.substr(packageScope.length + 1);
          } else {
            fileName = packageName;
          }

          let fileExists;
          if (packageScope) {
            fileExists = fs.existsSync(path.join(this.storageLocation, packageScope, packageName, packageName + '-' + packageVersion + '.tgz'));
          } else {
            fileExists = fs.existsSync(path.join(this.storageLocation, packageName, fileName + '-' + packageVersion + '.tgz'));
          }

          // Both have to be true for the version requested to be available
          resolve(versionExists && fileExists);
        });
    }).catch((err) => {
      console.log(err);
      return false;
    });
  }

  getPackageJson(packageName, packageScope = null) {
    return new Promise((resolve) => {

      let packageInfoLocation;
      if (packageScope) {
        packageInfoLocation = path.join(this.storageLocation, packageScope, packageName, 'package.json');
      } else {
        packageInfoLocation = path.join(this.storageLocation, packageName, 'package.json');
      }

      readJSON(packageInfoLocation)
        .then((data) => resolve(data));
    });
  }


  /* Dist-tag functions*/
  updatePackageJson(packageData) {
    let packageName = packageData._packageName;
    let packageScope = packageData._scope;
    let scopedName = packageData._scopedName;
    return new Promise((resolve) => {
      let packageInfoLocation;
      if (packageScope) {
        packageInfoLocation = path.join(this.storageLocation, packageScope, packageName, 'package.json');
      } else {
        packageInfoLocation = path.join(this.storageLocation, packageName, 'package.json');
      }

      writeJSON(packageInfoLocation, packageJson)
        .then((result) => resolve(result));
    });
  }
}