export default class {

  constructor(storage, validator) {
    this.storage = storage;
    this.packageValidator = validator;
  }

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

      this.storage.isPackageAvailable(packageData._packageName, packageData._scope)
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
      this.storage.updatePackageJson({
        name: packageData._packageName,
        scope: packageData._scope
      }, packageData).then((data) => {
        resolve(data);
      });
    });
  }

  writePackage(httpRequest, httpResponse) {
    let distTag;

    for (let key in httpRequest.body["dist-tags"]) {
      distTag = key;
    }

    this.packageValidator.hasDistTag(httpRequest.body, distTag)
      .then((result) => {
        if (result === true) {
          this.packageValidator.isVersionHigher(httpRequest.body._packageName,
            httpRequest.body["dist-tags"][distTag],
            distTag,
            httpRequest.body._scope
          ).then((result) => {
            if (result === false) {
              httpResponse.send("423, cannot publish, given version is invalid");
            } else {
              this.storage.writePackage({
                name: httpRequest.body._packageName,
                scope: httpRequest.body._scope
              }, httpRequest.body)
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
          });
        } else {
          httpResponse.status(403);
          httpResponse.send("cannot publish, given version is invalid");
        }
      });
  }

  writeNewPackage(httpRequest, httpResponse) {
    this.storage.writeNewPackage({
        name: httpRequest.body._packageName,
        scope: httpRequest.body._scope
      },
      httpRequest.body
    ).then((result) => {
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