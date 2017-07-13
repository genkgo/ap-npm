import crypto from 'crypto';

export default class {

  constructor(auth) {
    this.auth = auth;
  }

  /*
  * First checks if user exists, if so -> login
  * If user doesn't exist -> try to create user
  */
  process(httpRequest, httpResponse) {
    return new Promise((resolve, reject) => {
      let userInfo = {
        username: httpRequest.body.name,
        password: httpRequest.body.password,
        email: httpRequest.body.email,
        type: httpRequest.body.type
      };
      let userLoggedIn = false;
      this.loginUser(userInfo)
        .then((result) => {
        if (result === true) {
          userLoggedIn = true;
          this.generateToken(userInfo).then((token) => {
            httpResponse.status(201);
            httpResponse.send({
              token: token
            });
            resolve(userLoggedIn);
          });
        }
        else {
          this.createUser(userInfo)
            .then((result) => {
            if (result === true) {
              userLoggedIn = true;
              this.generateToken(userInfo).then((token) => {
                httpResponse.status(201);
                httpResponse.send({
                  token: token
                });
                resolve(userLoggedIn);
              });
            } else {
              reject('Cannot create user');
            }
          });
        }
      });
    }).catch((error) => {
      httpResponse.status(401);
      httpResponse.send("401, " + error);
    });
  }

  createUser(userInfo) {
    return this.auth.userAdd(userInfo.username, userInfo.password, userInfo.email);
  }

  loginUser(userInfo) {
    return this.auth.userLogin(userInfo.username, userInfo.password, userInfo.email);
  }

  generateToken(userInfo) {
    return new Promise((resolve) => {
      let token = crypto.randomBytes(64).toString('hex');
      this.auth.addTokenToDB(userInfo.username, token);
      resolve(token);
    });
  }

}