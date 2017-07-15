export default class {

  constructor(storage, validator) {
    this.storage = storage;
    this.packageValidator = validator;
  }

  /**
   * @param {class} httpRequest req
   * @param {class} httpResponse res
   * @return {void} -
   */
  process(httpRequest, httpResponse) {
    return new Promise((resolve, reject) => {
      let packageData = httpRequest.body;
      let packageName = packageData._packageName;
      let packageScope = packageData._scope;

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

      this.storage.isPackageAvailable({
        name: packageName,
        scope: packageScope
      }).then((available) => {
        if (available === true) {
          return this.writePackage(httpRequest, httpResponse);
        } else {
          return this.writeNewPackage(httpRequest, httpResponse);
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

  /**
   * @param {class} httpRequest req
   * @param {class} httpResponse res
   * @return {void} -
   */
  writePackage(httpRequest, httpResponse) {
    let distTag;
    for (let key in httpRequest.body["dist-tags"]) distTag = key;

    let packageName = httpRequest.body._packageName;
    let packageScope = httpRequest.body._scope;
    let packageData = httpRequest.body;

    this.packageValidator.hasDistTag({
        name: packageName,
        scope: packageScope
      }, distTag
    ).then((hasDistTag) => {
      if (hasDistTag === true) {
        this.packageValidator.isVersionHigher({
            name: packageName,
            scope: packageScope,
            version: packageData["dist-tags"][distTag]
          }, distTag
        ).then((result) => {
          if (result === false) {
            httpResponse.send("Cannot publish, given version already exists or is invalid");
          } else {
            this.storage.writePackage({
                name: packageName,
                scope: packageScope
              }, packageData
            ).then((result) => {
              if (result === true) {
                httpResponse.status(201);
                httpResponse.send({
                  ok: "package published"
                });
              } else {
                httpResponse.status(500);
                httpResponse.send({
                  message: "Error while writing package"
                });
              }
            });
          }
        });
      } else {
        httpResponse.status(403);
        httpResponse.send("Cannot publish, given version already exists or is invalid");
      }
    });
  }

  writeNewPackage(httpRequest, httpResponse) {
    let packageName = httpRequest.body._packageName;
    let packageScope = httpRequest.body._scope;
    this.storage.writeNewPackage({
        name: packageName,
        scope: packageScope
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
        httpResponse.send({message: "Error while writing package"});
      }
    });
  }
}