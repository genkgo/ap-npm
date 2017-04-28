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
    let userLoggedIn = false;
    let request;

    return new Promise((resolve, reject) => {
      request = this.loginUser(userInfo);

      request.then((result) => {
        if (result === true) {

          userLoggedIn = true;
          let token = this.generateToken(userInfo);
          httpResponse.status(201);
          httpResponse.send({
            token: token
          });

        }
        else {
          request = this.createUser(userInfo);
          request
            .then((result) => {

            if (result === true) {
              userLoggedIn = true;
              let token = this.generateToken(userInfo);
              httpResponse.status(201);
              httpResponse.send({
                token: token
              });
            }

          });
        }
      }).then(() => {
        resolve(userLoggedIn);
      });
    }).catch((error) => {
      httpResponse.send("404, user not found");
    });
  }

  createUser(userInfo) {
    return this.auth.userAdd(userInfo.username, userInfo.password, userInfo.email);
  }

  loginUser(userInfo) {
    return this.auth.userLogin(userInfo.username, userInfo.password, userInfo.email);
  }

  generateToken(userInfo) {
    let token = crypto.randomBytes(64).toString('hex');
    this.auth.addTokenToDB(userInfo.username, token);
    return token;
  }

}