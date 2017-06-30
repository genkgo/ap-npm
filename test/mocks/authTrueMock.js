export default class {
  constructor() {
  }

  userLogin(username, password, email) {
    return true;
  }

  userAdd(username, password, email) {
    return true;
  }

  userRemove(username, password) {
    return true;
  }

  shouldBeAbleTo(access, packageName, authorization) {
    return new Promise((resolve) => resolve);
  }
}