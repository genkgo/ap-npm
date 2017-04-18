// FOR TESTING PURPOSES ONLY
export default class {
  constructor() {
    this.users = {
      "test": {
        "password": "test",
        "email": "test@test.nl",
        "isloggedin": false
      }
    }
  }

  userExists(username) {
    return !!this.users[username];
  }

  userLogin(username, password) {
    if (!!this.users[username]) {
      if (this.users[username]['password'] === password) {
        this.users[username]['isloggedin'] = true;
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

  readJson(jsonLocation) {
    return JSON.parse(fs.readFileSync(jsonLocation));
  }

}