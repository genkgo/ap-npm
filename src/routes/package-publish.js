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
            this.writePackage(httpRequest, httpResponse);
          } else {
            this.writeNewPackage(httpRequest, httpResponse);
          }
        });
    }).catch((err) => {
      httpResponse.send(err);
    });
  }

  deprecateUpdater(packageData) {
    return new Promise((resolve) => {
      this.storage.updatePackageJson(packageData).then((data) => {
        resolve(data);
      });
    });
  }

  writePackage(httpRequest, httpResponse) {

    let distTag;

    this.storage.isVersionAvailable(httpRequest.body)
      .then(result => {
          if (result === true) {
            httpResponse.status(403);
            httpResponse.send({message: "Cannot publish, version already exists"});
          } else {
            for (let key in httpRequest.body['dist-tags']) {
              distTag = key;
            }

            this.packageValidator.hasDistTag(httpRequest.body, distTag)
              .then((result) => {
                if (result === true) {
                  this.packageValidator.isVersionHigher(httpRequest.body._packageName,
                    httpRequest.body._scope,
                    httpRequest.body['dist-tags'][distTag],
                    distTag
                  ).then((result) => {
                    if (result === false) {
                      httpResponse.send("423, cannot publish, given version is invalid");
                    } else {
                      this.storage.writePackage(httpRequest.body)
                        .then((result) => {
                          if (result === true) {
                            httpResponse.status(201);
                            httpResponse.send({
                              ok: "package published"
                            });
                          } else {
                            httpResponse.status(500);
                            httpResponse.send({
                              message: "error while writing package"
                            });
                          }
                        });
                    }
                  })
                } else {
                  httpResponse.status(403);
                  httpResponse.send({message: "cannot publish, given version is invalid"});
                }
              });
          }
        }
      );
  }

  writeNewPackage(packageData, httpRequest, httpResponse) {
    this.storage.writeNewPackage(packageData)
      .then((result) => {
        if (result === true) {
          httpResponse.status(201);
          httpResponse.send({
            ok: "package published"
          });
        } else {
          httpResponse.status(500);
          httpResponse.send({message: "error while writing package"});
        }
      });
  }
}