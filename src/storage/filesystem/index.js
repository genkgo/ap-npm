import packageHandler from 'package-handler';

export default class {
  getPackage(request, response) {
    return packageHandler.findPackage(request.get('name'), response);
  }

  addPackage(request, response) {
    return packageHandler.addPackage(request, response);
  }

  removePackage(request, response) {
    return packageHandler.removePackage(request, response);
  }

  packageExists(request, response) {
    return packageHandler.findPackage(request, response);
  }
}