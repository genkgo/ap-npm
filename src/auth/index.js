import fs from 'fs';
import path from 'path';
import js_sha from 'js-sha256';
import config from '../config';


/*
* This file serves as a way to implement an authentication server.
* The current implementation serves as a simple example of local authentication.
* ap-npm was created to be easily extensible (which alternatives weren't).
* We promote implementing a proper authentication method.
*/
export default class {
  constructor() {
    let user_db_path = path.join(__dirname, '../..', 'db', 'user_db.json');
    let user_tokens_path = path.join(__dirname, '../..', 'db', 'user_tokens.json');

    try {
      let user_db_json = fs.readFileSync(user_db_path, 'utf8');
      let user_tokens = fs.readFileSync(user_tokens_path, 'utf8');
      this.users = JSON.parse(user_db_json);
      this.tokens = JSON.parse(user_tokens);
    } catch (e) {
      this.users = {};
      this.tokens = {};
    }

    this.settings = config.auth;
  }

  userExists(username) {
    return typeof(this.users[username]) === "object";
  }

  userLogin(username, password, email) {
    try {
      if (this.users[username]['password'] === js_sha.sha256(password) && this.users[username]['email'] === email) {
        // User valid
        return true;
      }
    } catch (err) {
      return false;
    }
  }

  userLogout(username) {
    // Not used right now
  }

  userAdd(username, password, email) {
    if (this.settings.register) {
      if (typeof(this.users[username]) !== "object") {
        // User already exists
        return false;
      } else {
        this.users[username] = {
          username: username,
          password: js_sha.sha256(password),
          email: email,
        };
        this.updateDB();

        // Success
        return true;
      }
    } else {
      return false;
    }
  }

  userRemove(username, password) {
    if (this.settings.remove) {
      if (!!this.users[username] && !!this.users[username][password] === js_sha.sha256(password)) {
        this.users.remove(username);
        this.updateDB();

        // Success
        return true;
      }

    } else {
      return false;
    }
  }

  shouldBeAbleTo(accessType, packageName, accessToken) {
    return Promise.resolve();
  }

  verifyToken(token) {
    return this.tokens[token];
  }

  readJson(jsonLocation) {
    return JSON.parse(fs.readFileSync(jsonLocation));
  }

  updateDB() {
    let user_db_path = path.join(__dirname, '..', 'auth', 'user_db.json');
    fs.writeFileSync(user_db_path, JSON.stringify(this.users, null, 2));
  }

}