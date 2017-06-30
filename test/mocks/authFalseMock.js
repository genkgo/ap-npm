export default class {
  constructor() {
  }

  userLogin(username, password, email) {
    return false;
  }

  userAdd(username, password, email) {
    return false;
  }

  userRemove(username, password) {
    return false;
  }

  shouldBeAbleTo(access, packageName, authorization) {
    return Promise.reject();
  }
}