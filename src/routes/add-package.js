export default class {

  constructor(localStorage) {
    this.localStorage = localStorage;
  }

  handle (request, response) {
    let packageName = request.get('name');
    let packageData = request.get('packageData');
    try {
      let packageExists = this.localStorage.findPackage(packageName, response);
      if (packageExists) {
        this.localStorage.addPackage(packageName, packageData , response);
      }
    } catch (e) {
      throw new Error('Cannot find package ' + packageName);
    }
  }
}
