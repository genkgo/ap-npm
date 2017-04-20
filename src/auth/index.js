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
    this.initUserDB();
    this.initTokenDB();
    this.settings = config.auth;
  }

  userExists(username) {
    return typeof(this.users[username]) === "object";
  }

  userLogin(username, password, email) {
    try {
      console.log("working");
      if (this.users[username]['password'] === js_sha.sha256(password) && this.users[username]['email'] === email) {
        return true;
      }
    } catch (err) {
      return false;
    }
  }

  userLogout(token) {
    let user_tokens_path = path.join(__dirname, '../..', 'db', 'user_tokens.json');
    let allTokens;

    try {
      let tokenString = fs.readFileSync(user_tokens_path, 'utf8');
      allTokens = JSON.parse(tokenString);
      delete allTokens[token];
    } catch (e) {
      // On error: just make the tokens_db an empty db.
      allTokens = {};
    }

    fs.writeFileSync(user_tokens_path, JSON.stringify(allTokens, null, 2));
    this.updateTokenDB();
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
        this.updateUserDB();

        // Success
        return true;
      }
    } else {
      return false;
    }
  }

  userRemove(username, password) {
    if (this.settings.remove) {
      try {
        if (this.users[username] && this.users[username][password] === js_sha.sha256(password)) {
          this.users.remove(username);
          this.updateUserDB();

          // Success
          return true;
        }
      } catch (err) {
        return false;
      }
    } else {
      return false;
    }
  }

  shouldBeAbleTo(accessType, packageName, accessToken) {
    let accessToken = accessToken.substr(7);

    if (config.auth.public === true) {
      return Promise.resolve();
    }

    if (accessType === 'access') {
      if (config.auth.users.canAccess) {
        let user = this.verifyToken(accessToken);
        if (user) {
          return Promise.resolve();
        } else {
          return Promise.reject("Invalid user");
        }
      } else {
        return Promise.reject("Users are not allowed access");
      }
    }

    else if (accessType === 'publish') {
      if (config.auth.users.canPublish) {
        let user = this.verifyToken(accessToken);
        if (user) {
          return Promise.resolve();
        } else {
          return Promise.reject("Invalid user");
        }
      } else {
        return Promise.reject("Users are not allowed to publish");
      }
    }
  }

  verifyToken(token) {
    return this.tokens[token];
  }

  readJson(jsonLocation) {
    return JSON.parse(fs.readFileSync(jsonLocation));
  }

  updateUserDB() {
    let user_db_path = path.join(__dirname, '..', 'auth', 'user_db.json');
    fs.writeFileSync(user_db_path, JSON.stringify(this.users, null, 2));
    this.initUserDB();
  }

  updateTokenDB() {
    let user_tokens_path = path.join(__dirname, '../..', 'db', 'user_tokens.json');
    fs.writeFileSync(user_tokens_path, JSON.stringify(this.tokens, null, 2));
    this.initTokenDB();
  }

  initUserDB() {
    let user_db_path = path.join(__dirname, '../..', 'db', 'user_db.json');
    try {
      let user_db_json = fs.readFileSync(user_db_path, 'utf8');
      this.users = JSON.parse(user_db_json);
    } catch (err) {
      this.users = {};
    }
  }

  initTokenDB() {
    let user_token_path = path.join(__dirname, '../..', 'db', 'user_tokens.json');
    try {
      let user_tokens_json = fs.readFileSync(user_tokens_path, 'utf8');
      this.tokens = JSON.parse(user_tokens_json);
    } catch (e) {
      this.tokens = {};
    }
  }

}