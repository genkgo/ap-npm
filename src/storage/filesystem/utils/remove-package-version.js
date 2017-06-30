import fs from 'fs';
import path from 'path';
import semver from 'semver';

export default function (packageName,
                         packageScope,
                         packageVersion,
                         getPackageJson,
                         updatePackageJson,
                         removePackage,
                         storageLocation) {
  return new Promise((resolve, reject) => {
    let packageLocation = path.join(storageLocation, packageName);
    let tarballLocation = path.join(packageLocation, packageName + packageVersion + '.tgz');

    fs.exists(packageLocation + '/package.json', (exists) => {
      if (!exists) {
        reject("Invalid request, aborting");
      }

      // location is valid
      fs.unlink(tarballLocation, () => {
        let packageJson = getPackageJson({
          name: packageName,
          scope: packageScope
        }).then(() => {
          delete (packageJson.versions[packageVersion]);

          // If this was the last version of the package, we can remove it completely
          if (packageJson.versions.size === 0) {
            removePackage(packageName);
            return true;
          }

          if (packageJson['dist-tags'].latest === packageVersion) {
            // need to update dist-tags
            let highestVersion = '0.0.1';
            for (let key in packageJson.versions) {
              if (semver.satisfies(key, '>' + highestVersion)) {
                highestVersion = key;
              }
            }
            packageJson['dist-tags'].latest = highestVersion;
          }
          updatePackageJson(packageName, packageJson, storageLocation)
            .then((result) => {
              resolve(result);
            });
        });
      });
    });
  });
}