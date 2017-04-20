import crypto from 'crypto';
import path from 'path';
import fs from 'fs';


export default class {

  constructor(auth) {
    this.auth = auth;
  }

  /*
  * First checks if user exists, if so -> login
  * If user doesn't exist -> try to create user
  */
  process(httpRequest, httpResponse) {
    let userInfo = {
      username: httpRequest.body.name,
      password: httpRequest.body.password,
      email: httpRequest.body.email,
      type: httpRequest.body.type
    };

    let addTokenToDB = (username, token) => {
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
    };

    if (this.auth.userExists(userInfo.username)) {
      let token = crypto.randomBytes(64).toString('hex');
      let result = this.auth.userLogin(userInfo.username, userInfo.password, userInfo.email);

      if (result === true) {
        console.log("User logged in: " + userInfo.username + ', ' + userInfo.email);
        httpResponse.status(201);
        httpResponse.send({
          token: token
        });
        addTokenToDB(userInfo.username, token);
      } else {
        httpResponse.status(404).send({
          Error: "Could not login user"
        });
      }
    }

    // User doesn't exist, try to create user
    else {
      if (this.auth.userAdd(userInfo.username, userInfo.password, userInfo.email)) {
        let token = crypto.randomBytes(64).toString('hex');
        addTokenToDB(userInfo.username, token);
        httpResponse.status(201);
        httpResponse.send({
          ok: "you are authenticated as '" + userInfo.username + "'",
          token: token
        });
      } else {
        httpResponse.status(400).send({
          Error: "Could not create user"
        });
      }
    }

  }

}