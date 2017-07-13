export default class {
  userLogin(username, password, email) {
    return Promise.resolve(true);
  }

  userAdd(username, password, email) {
    return Promise.resolve(true);
  }

  userLogout(token) {
    return Promise.resolve(this.logoutToken = token);
  }

  userRemove(username, password) {
    return Promise.resolve(true);
  }

  shouldBeAbleTo(access, packageName, authorization) {
    return Promise.resolve(true);
  }

  addTokenToDB(username, token) {
    this.token = token;
    this.username = username;
  }

  verifyToken(token) {
    if (token === '123456789') {
      return 'username';
    } else {
      return false;
    }
  }
}