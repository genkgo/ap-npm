import crypto from 'crypto';
import config from '../config';

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

    try {
      if (this.loginUser(userInfo)) {
        let token = this.generateToken(userInfo);
        httpResponse.status(201);
        httpResponse.send({
          token: token
        });
        return;
      }
    } catch (err) {}

    if (config.auth.register === false) {
      httpResponse.send("401, Could not create user");
    } else {
      try {
        if (this.createUser(userInfo)) {
          let token = this.generateToken(userInfo);
          httpResponse.status(201);
          httpResponse.send({
            token: token
          });
          return;
        }
      } catch (err) {
        // Cannot create user
        httpResponse.send("400, Could not create user");
        return;
      }

      httpResponse.send("404, Could not login or register user");
    }
  }

  createUser(userInfo) {
    let userCreated = this.auth.userAdd(userInfo.username, userInfo.password, userInfo.email);
    if (userCreated) {
      return true;
    } else {
      throw new Error("Could not create user");
    }
  }

  loginUser(userInfo) {
    try {
      return this.auth.userLogin(userInfo.username, userInfo.password, userInfo.email);
    } catch (err) {
      throw new Error("Could not login user");
    }
  }

  generateToken(userInfo) {
    let token = crypto.randomBytes(64).toString('hex');
    this.auth.addTokenToDB(userInfo.username, token);
    return token;
  }

}