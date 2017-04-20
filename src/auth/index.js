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
    /*
    * If a new authentication method has been added, comment out the inits.
    */
    this.initUserDB();
    this.initTokenDB();
    this.settings = config.auth;
  }



  /*
  * userLogin, userAdd and userRemove are functions that can be altered to implement an alternative auth method.
  */
  userLogin(username, password, email) {
    return this.users[username]['password'] === js_sha.sha256(password) && this.users[username]['email'] === email;
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
        this.initUserDB();

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



  /*
  * Don't touch the rest, it relies on the above functions to work properly
  */
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

  shouldBeAbleTo(accessType, packageName, accessToken) {
    if (config.auth.public === true) {
      return Promise.resolve();
    }

    if (accessToken) {
      accessToken = accessToken.substr(7);
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

    // If anything fails
    return Promise.reject();
  }

  verifyToken(token) {
    return this.tokens[token];
  }

  readJson(jsonLocation) {
    return JSON.parse(fs.readFileSync(jsonLocation));
  }

  updateUserDB() {
    let user_db_path = path.join(__dirname, '../..', 'auth', 'user_db.json');
    fs.writeFileSync(user_db_path, JSON.stringify(this.users, null, 2));
    this.initUserDB();
  }

  updateTokenDB() {

  }

  addTokenToDB(username, token) {
    let tokenLocation = path.join(__dirname, '../..', 'db', 'user_tokens.json');
    let tokens;

    if (fs.existsSync(tokenLocation)) {
      let jsonString = fs.readFileSync(tokenLocation);
      tokens = JSON.parse(jsonString);
    }
    else {
      tokens = {};
    }

    tokens[token] = username;
    fs.writeFileSync(tokenLocation, JSON.stringify(tokens, null, 2));
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
      let user_tokens_json = fs.readFileSync(user_token_path, 'utf8');
      this.tokens = JSON.parse(user_tokens_json);
    } catch (e) {
      this.tokens = {};
    }
  }

}