export default class {

  constructor(localStorage, remoteStorage) {
    this.localStorage = localStorage;
    this.remoteStorage = remoteStorage;
  }

  handle (request, response) {
    let packageName = request.get('name');
    try {
      this.localStorage.find(packageName);
    } catch (e) {
      this.remoteStorage.find(packageName);
    }
  }
}

