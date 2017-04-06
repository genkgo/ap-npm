import fs from 'fs';
import config from './../../config';
import semver from 'semver';

let storageLocation = config.storage.directory;
let fileSystem = new fs();

let packageTemplate = function (packageName) {
  return {
    name: packageName,
    versions: {},
    'dist-tags': {
      'latest': ''
    },

  }
};

export default class {

  findTarball(request, response) {
    let packageName = request.get('packageName');
    let requestedVersion = request.get('packageVersioner');
    let packageLocation = storageLocation + '/' + request.get('packageName');

    let doesVersionExist = (version, location) => {
      let packageDetails = this.getPackageDetails(location);
      let availableVersions = packageDetails['versions'];
      return version in availableVersions;
    };

    if (fileSystem.existsSync(storageLocation + '/' + packageName)) {
      if (doesVersionExist()) {

      }
    }
  }

  saveTarball(request, response) {
    let packageName = request.get('packageName');
    let packageVersion = request.get('packageVersioner');
    let packageData = request.get('packageData');
    let packageLocation = storageLocation + '/' + request.get('packageName');

    let getLatestVersion = (availableVersions) => {
      let latestVersion = '0.0.0';
      for (var version in availableVersions) {
        if (semver(version + '=>' + latestVersion)) {
          latestVersion = version;
        }
      }

      return latestVersion;
    };

    let writeTarball = (packageVersion, packageLocation, packageData) => {
      // TODO: Make this write a tarball.

    };

    // Check if package exists
    if (fileSystem.existsSync(packageLocation)) {
      let packageJSON = this.getPackageDetails(packageLocation);
      let availableVersions = oldPackageJSON['versions'];
      let latestVersion = getLatestVersion(availableVersions);

      if (semver(latestVersion + '=>' + packageVersioner)) {
        // Package is valid
        try {
          writeTarball(packageVersioner, packageLocation, packageData);
          let newPackageJSON = oldPackageJSON;

          packageJSON['dist-tags']['latest'] = latestVersion;

          this.writePackageDetails(packageLocation, packageJSON);

        } catch (err) {
          throw new Error("Error writing package: " + packageName);
        }
      }

      response(packageLocation);
    }
    // Package does not exist, create directory
    else {
      fileSystem.mkdirSync(packageLocation, '0775');
      if (semver.valid(packageVersioner)) {
        try {
          writeTarball(packageVersioner, packageLocation, packageData);
        } catch (err) {
          throw new Error("Error writing package " + packageName);
        }

        let packageJSON = packageTemplate(packageName);
        packageJSON['dist-tags']['latest'] = packageVersioner;
        this.writePackageDetails(packageLocation, packageJSON);

      } else {
        throw new Error("Error packageversion is invalid.");
      }

    }
  }

  deletePackage(request, response) {
    let packageName = request.get('packageName');
    let packageLocation = storageLocation + '/' + packageName;
    // TODO: Delete npm package entry from local filesystem

    let deleteFolderRecursive = function (path, fs) {
      if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file,index){
          let curPath = path + "/" + file;
          if(fs.lstatSync(curPath).isDirectory()) { // recurse
            deleteFolderRecursive(curPath);
          } else { // delete file
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(path);
      }
    };

    if (fileSystem.existsSync(packageLocation)) {
      deleteFolderRecursive(packageLocation, fileSystem);
    } else {
      throw new Error("Error: package cannot be deleted.")
    }
  }

  getAvailablePackages(request, response) {
    let availablePackages = [];
    try {
      fileSystem.readdir(storageLocation, (err, packages)  => {
        packages.forEach((pkg) => {
          let packageLocation = storageLocation + '/' + pkg;
          let packageDetails = this.getPackageDetails(packageLocation);
          if (packageDetails['versions']) {
            availablePackages.push({
              "name": pkg,
              "versions": packageDetails['versions']
            });
          }
        })
      });
    } catch (e) {
      throw new Error("Error reading storage.");
    }

    response(availablePackages);
  }

  lockFile(request, response) {
    // TODO: Be able to lock a file
  }

  isFileLocked(request, response) {

  }

  getPackageDetails(packageLocation) {
    return JSON.parse(fileSystem.readFileSync(packageLocation + '/package.json'));
  }

  writePackageDetails(packageLocation, packageJSON) {
    fs.writeFileSync(
      packageLocation + '/package.json',
      JSON.stringify(packageJSON, null, 2)
    );
  }

}