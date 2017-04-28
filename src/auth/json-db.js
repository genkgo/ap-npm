import js_sha from 'js-sha256';
import path from 'path';
import fs from 'fs';

/*
 * This file serves as a way to implement an authentication server.
 * The current implementation serves as a simple example of local authentication.
 * ap-npm was created to be easily extensible (which alternatives weren't).
 * We promote implementing a proper authentication method.
 */
export default class {
  constructor(config) {
    this.dbLocation = path.join(config.workDir, 'db');
    this.initUserDB();
    this.settings = config.auth;
  }

  userLogin(username, password, email) {
    return new Promise((resolve) => {
      let userLoggedIn;
      try {
        userLoggedIn = this.users[username]['password'] === js_sha.sha256(password) && this.users[username]['email'] === email;

        if (userLoggedIn) {
          resolve(userLoggedIn);
        }
      } catch(err) {
        resolve(false);
      }
    }).catch((err) => {
      console.log(err);
      return false;
    })
  }

  userAdd(username, password, email) {
    return new Promise((resolve) => {
      if (this.settings.register) {
        if (typeof(this.users[username]) === "object") {
          resolve(false);
        } else {
          this.users[username] = {
            username: username,
            password: js_sha.sha256(password),
            email: email,
          };
          this.updateUserDB();
          this.initUserDB();

          // Success
          resolve(true);
        }
      } else {
        resolve(false);
      }
    }).catch((err) => {
      console.log(err);
      return false;
    });
  }

  /*
  * Doesn't get used yet, npm doesn't implement it and neither have we (yet)
  */
  userRemove(username, password) {
    return new Promise((resolve, reject) => {
      if (this.settings.remove) {
        if (this.users[username] && this.users[username][password] === js_sha.sha256(password)) {
          this.users.remove(username);
          this.updateUserDB();

          // Success
          resolve(true);
        }
      } else {
        reject("Not allowed to remove users");
      }
    }).catch((err) => {
      console.log(err);
      return false;
    });
  }


  // Just here for local auth
  initUserDB() {
    let user_db_path = path.join(this.dbLocation, 'user_db.json');

    if (!fs.existsSync(this.dbLocation)) {
      try {
        fs.mkdirSync(this.dbLocation, '0777', true);
      } catch (err) {
        console.log("Error making userDB folder (" + this.dbLocation + "), ap-npm might malfunction");
      }
    }
    try {
      let user_db_json = fs.readFileSync(user_db_path, 'utf8');
      this.users = JSON.parse(user_db_json);
    } catch (err) {
      this.users = {};
    }
  }

  // Just here for local auth
  updateUserDB() {
    let user_db_path = path.join(this.dbLocation, 'user_db.json');
    fs.writeFileSync(user_db_path, JSON.stringify(this.users, null, 2), {'mode': '0777'});
    this.initUserDB();
  }
}