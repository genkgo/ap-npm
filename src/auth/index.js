// FOR TESTING PURPOSES ONLY
export default class {
  constructor() {
    this.users = {
      "test": {
        "password": "test",
        "email": "test@test.nl",
        "token": null
      }
    }
  }

  userExists(username) {
    return !!this.users[username];
  }

  userLogin(username, password) {
    if (!!this.users[username]) {
      if (this.users[username]['password'] === password) {
        this.users[username]['token'] = "valid";
        // User valid
        return true;
      }
    }

    // User invalid
    return false;
  }

  userLogout(username) {
    this.users[username]['isloggedin'] = false;
  }

  userAdd(username, password, email) {
    if (this.users[username]) {
      return false;
    } else {
      this.users[username] = {
        password: password,
        email: email,
        isloggedin: true
      };

      return true;
    }
  }

  userRemove(username, password) {

  }

  verifyToken(token) {
    // Verify the token and return its user *** TODO
    return "username";
  }

  readJson(jsonLocation) {
    return JSON.parse(fs.readFileSync(jsonLocation));
  }

}