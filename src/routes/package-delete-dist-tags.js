export default class {

  constructor(storage, validator) {
    this.storage = storage;
    this.packageValidator = validator;
  }

  process(httpRequest, httpResponse) {
    return new Promise((resolve, reject) => {
      let packageName = httpRequest.params.package;
      let distTag = httpRequest.params.tag;

      this.storage.getPackageJson({
        name: httpRequest.params.package
      }).then((packageJson) => {
          delete(packageJson['dist-tags'][distTag]);

          this.storage.updatePackageJson({
            name: packageName
          }, packageJson)
            .then((result) => {
              if (result === true) {
                httpResponse.status(200);
                resolve(httpResponse.send({
                  ok: "dist-tags updated"
                }));
              } else {
                reject("404, could not get dist-tags");
              }
            });
        });
    }).catch((err) => {
      httpResponse.send(err);
    });
  }
}