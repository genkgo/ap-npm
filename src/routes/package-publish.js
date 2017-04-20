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

    if (!packageData._attachments) {
      if (this.deprecateUpdater(packageData)) {
        httpResponse.status(200).send({
          ok: "packageJson udpated"
        });
        return;
      }
    }

    // Error checking
    if (this.packageValidator.doesPackageExist(packageData.name)) {
      try {
        if (this.packageValidator.doesVersionExist(packageData.name, packageData['dist-tags']['latest'])) {
          httpResponse.send("422, cannot publish, version already exists");
          return;
        }
      } catch (err) {
        httpResponse.send("422, cannot publish, filesystem error");
        return;
      }

      let distTag;
      for (let key in packageData['dist-tags']) {
        distTag = key;
      }

      if (this.packageValidator.hasDistTag(packageData.name, distTag)) {
        if (!this.packageValidator.isVersionHigher(packageData.name, packageData['dist-tags'][distTag], distTag)) {
          httpResponse.send("423, cannot publish, given version is invalid");
          return;
        }
      }

      try {
        this.storage.writePackage(packageData);
      } catch (err) {
        httpResponse.send("421, " + err.toString());
        return;
      }
    }

    // Package doesn't exist yet
    else {
      try {
        this.storage.writeNewPackage(packageData);
      } catch (err) {
        httpResponse.send("421, " + err.toString());
        return;
      }
    }

    httpResponse.status(201);
    httpResponse.send({
      ok: "package published"
    });
  }

  deprecateUpdater(packageData) {
    return this.storage.updatePackageJson(packageData.name, packageData);
  }


}