export default class {
  userLogin(username, password, email) {
    return Promise.resolve(false);
  }

  userAdd(username, password, email) {
    return Promise.resolve(false);
  }

  userRemove(username, password) {
    return Promise.resolve(false);
  }

  shouldBeAbleTo(access, packageName, authorization) {
    return Promise.resolve(false);
  }

  addTokenToDB(username, token) {
    return Promise.reject('I should not have been called');
  }
}