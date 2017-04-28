export default class {

  constructor(auth) {
    this.auth = auth;
  }

  /*
  * npm whoami sends its token to the server and requests a username
  * This route verifies which user is logged in and sends back its username
  */
  process(httpRequest, httpResponse) {
    return new Promise((resolve, reject) => {
      let token = httpRequest.headers.authorization.substr(7);
      let user;
      user = this.auth.verifyToken(token);

      if (user !== false) {
        httpResponse.send({
          username: user
        });
        resolve();
      } else {
        reject();
      }
    }).catch(() => {
      httpResponse.status(401);
      httpResponse.send('401, invalid user');
    });
  }
}