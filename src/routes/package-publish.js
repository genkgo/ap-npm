export default class {

  constructor(storage, validator) {
    this.storage = storage;
    this.packageValidator = validator;
  }

  /*
  * First validates if package is valid
  * Adds a version to the package in filesystem or creates a new package
  * Sends a 201 to let npm know package was published
  */
  process(httpRequest, httpResponse) {
    return new Promise((resolve, reject) => {
    let packageData = httpRequest.body;

    if (!packageData._attachments) {
      this.deprecateUpdater(packageData).then((result) => {
        if (result) {
          httpResponse.status(200).send({
            ok: "packageJson updated"
          });
          resolve();
        } else {
          reject("420, error: cannot update");
        }
      });
    }

    this.packageValidator.doesPackageExist(packageData.name)
      .then((result) => {
      if (result === true) {
        this.packageValidator.doesVersionExist(packageData.name, packageData['dist-tags']['latest'])
          .then((result) => {
          if (result === true) {
            reject("422, cannot publish, version already exists");
          } else {


            let distTag;
            for (let key in packageData['dist-tags']) {
              distTag = key;
            }

            this.packageValidator.hasDistTag(packageData.name, distTag).then((result) =>  {
              if (result === true) {
                this.packageValidator.isVersionHigher(packageData.name, packageData['dist-tags'][distTag], distTag).then((result) => {
                  if (result === false) {
                    reject("423, cannot publish, given version is invalid");
                  }
                  else {
                    this.storage.writePackage(packageData)
                      .then((result) => {
                        if (result === true) {
                          httpResponse.status(201);
                          httpResponse.send({
                            ok: "package published"
                          });
                          resolve()
                        } else {
                          reject("421, error while writing package");
                        }
                      });
                  }
                })
              } else {
                reject("423, cannot publish, given version is invalid");
              }
            });
          }});

      } else {
        this.storage.writeNewPackage(packageData)
          .then((result) => {
            if (result === true) {
              httpResponse.status(201);
              httpResponse.send({
                ok: "package published"
              });
              resolve();
            } else {
              reject("421, error while writing package");
            }
          })
        }
      });
    }).catch((err) => {
      httpResponse.send(err);
    })
  }

  deprecateUpdater(packageData) {
    return new Promise((resolve) => {
      this.storage.updatePackageJson(packageData.name, packageData).then((data) => {
        resolve(data);
      })
    });
  }


}