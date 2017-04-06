import fileHandler from 'file-handler';
import remoteResolver from 'remote-resolver';

export default class {

  addPackage(request, response) {
    return fileHandler.saveTarball(request, response);
  }

  findPackage(request, response) {
    let packageResolver = fileHandler.findTarball(request, response);
    if (packageResolver) {
      return packageResolver;
    } else {
      return this.findRemotePackage(request, response);
    }
  }

  removePackage(request, response) {
    try {
      fileHandler.deletePackage(request, response);
    } catch(e) {
      throw new Error('Cannot find package ' + name);
    }
  }

  findRemotePackage(request, response){
    return remoteResolver.getRemotePackage(request, response);
  }

}