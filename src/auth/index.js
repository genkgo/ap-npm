import fs from 'fs';
import path from 'path';
import config from '../config';
import Method from './method';

export default class {

  constructor() {
    this.dbLocation = path.join(config.workDir, 'db');
    this.initTokenDB();
    this.settings = config.auth;

    this.authMethod = new Method();
  }

  userLogin(username, password, email) {
    return this.authMethod.userLogin(username, password, email);
  }

  userAdd(username, password, email) {
    return this.authMethod.userAdd(username, password, email);
  }

  userRemove(username, password) {
    return this.authMethod.userRemove(username, password);
  }

  userLogout(token) {
    let user_tokens_path = path.join(this.dbLocation, 'user_tokens.json');
    let allTokens;

    return new Promise((resolve, reject) => {
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
      resolve();
    });
  }

  shouldBeAbleTo(accessType, packageName, accessToken) {
    return new Promise((resolve, reject) => {
      if (config.auth.public === true) {
        resolve();
      }

      if (accessToken) {
        accessToken = accessToken.substr(7);
      }

      if (accessType === 'access') {
        if (config.auth.users.canAccess) {
          let user = this.verifyToken(accessToken);
          if (user) {
            resolve();
          } else {
            reject("Invalid user");
          }
        } else {
          reject("Users are not allowed access");
        }
      }

      else if (accessType === 'publish') {
        if (config.auth.users.canPublish) {
          let user = this.verifyToken(accessToken);
          if (user) {
            resolve();
          } else {
            reject("Invalid user");
          }
        } else {
          reject("Users are not allowed to publish");
        }
      }

      // If anything fails
      reject();

    });
  }

  verifyToken(token) {
    return this.tokens[token];
  }

  readJson(jsonLocation) {
    return JSON.parse(fs.readFileSync(jsonLocation));
  }



  updateTokenDB() {
    let tokenLocation = path.join(this.dbLocation, 'user_tokens.json');
    fs.writeFileSync(tokenLocation, JSON.stringify(this.tokens, null, 2));
  }

  addTokenToDB(username, token) {
    let tokenLocation = path.join(this.dbLocation, 'user_tokens.json');
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

  initTokenDB() {
    let user_token_path = path.join(this.dbLocation, 'user_tokens.json');
    try {
      let user_tokens_json = fs.readFileSync(user_token_path, 'utf8');
      this.tokens = JSON.parse(user_tokens_json);
    } catch (e) {
      this.tokens = {};
    }
  }

}