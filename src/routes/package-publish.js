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
    let packageData = httpRequest.body;

    // Error checking
    if (this.packageValidator.doesPackageExist(packageData.name)) {
      try {
        if (this.packageValidator.doesVersionExist(packageData.name, packageData['dist-tags']['latest'])) {
          httpResponse.status(422);
          httpResponse.send({
            Error: "cannot publish, version already exists"
          });
          return;
        }
      } catch (err) {
        console.log(err);
        httpResponse.status(422);
        httpResponse.send({
          Error: "cannot publish, filesystem error"
        });
        return;
      }

      let distTag;
      for (let key in packageData['dist-tags']) {
        distTag = key;
      }

      if (this.packageValidator.hasDistTag(packageData.name)) {
        if (!this.packageValidator.isVersionHigher(packageData.name, packageData['dist-tags'][distTag])) {
          httpResponse.status(423);
          httpResponse.send({
            Error: "cannot publish, given version is invalid"
          });
          return;
        }
      }

      try {
        this.storage.writePackage(packageData);
      } catch (err) {
        console.log(err);
        httpResponse.status(421);
        httpResponse.send({
          Error: err.toString()
        });
        return;
      }
    }

    // Package doesn't exist yet
    else {
      try {
        this.storage.writeNewPackage(packageData);
      } catch (err) {
        console.log(err);
        httpResponse.status(421);
        httpResponse.send({
          Error: err.toString()
        });
        return;
      }
    }

    httpResponse.status(201);
    httpResponse.send({
      ok: "package published"
    });
  }

}