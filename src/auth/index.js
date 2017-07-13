import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';

export default class {

  constructor(adapter, config, logger) {
    this.dbLocation = path.join(config.workDir, 'db');
    try {
      this.storageInit()
    } catch (err) {
      logger.error("Failed to initialize auth-structure in " + this.dbLocation);
    }
    this.initTokenDB();
    this.settings = config.auth;
    this.adapter = adapter;
  }

  storageInit() {
    let userTokens = path.join(this.dbLocation, 'user_tokens.json');

    if (!fse.ensureDirSync(this.dbLocation)) {
      fse.mkdirsSync(this.dbLocation);
    }

    if (!fse.ensureFileSync(userTokens)) {
      fse.outputJsonSync(userTokens, {});
    }
  }

  userLogin(username, password, email) {
    return this.adapter.userLogin(username, password, email);
  }

  userAdd(username, password, email) {
    return this.adapter.userAdd(username, password, email);
  }

  userRemove(username, password) {
    return this.adapter.userRemove(username, password);
  }

  userLogout(token) {
    let user_tokens_path = path.join(this.dbLocation, 'user_tokens.json');
    let allTokens;

    return new Promise((resolve) => {
      try {
        let tokenString = fs.readFileSync(user_tokens_path, 'utf8');
        allTokens = JSON.parse(tokenString);
        delete allTokens[token];
      } catch (e) {
        allTokens = {};
      }

      fs.writeFileSync(user_tokens_path, JSON.stringify(allTokens, null, 2), {'mode': '0777'});
      this.updateTokenDB();
      resolve();
    });
  }

  shouldBeAbleTo(accessType, packageName, accessToken) {
    return new Promise((resolve, reject) => {
      if (this.settings.public === true) {
        resolve();
      }

      if (accessToken) {
        accessToken = accessToken.substr(7);
      }

      if (accessType === 'access') {
        if (this.settings.users.canAccess) {
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
        if (this.settings.users.canPublish) {
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

      reject();
    });
  }

  verifyLogin(username, password) {
    return this.adapter.userLogin(username, password);
  }

  verifyToken(token) {
    if (typeof this.tokens[token] === 'string') {
      return this.tokens[token];
    } else {
      return false;
    }
  }

  updateTokenDB() {
    let tokenLocation = path.join(this.dbLocation, 'user_tokens.json');
    fs.writeFileSync(tokenLocation, JSON.stringify(this.tokens, null, 2), {'mode': '0777'});
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
    fs.writeFileSync(tokenLocation, JSON.stringify(tokens, null, 2), {'mode': '0777'});
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