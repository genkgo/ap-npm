export default class {

  constructor(auth) {
    this.auth = auth;
  }

  /*
  * npm whoami sends its token to the server and requests a username
  * This route verifies which user is logged in and sends back its username
  */
  process(httpRequest, httpResponse) {
    let token = httpRequest.headers.authorization.substr(7);
    let user;

    return new Promise((resolve, reject) => {
      user = this.auth.verifyToken(token);

      if (user !== false) {
        httpResponse.send({
          username: "you are logged in as '" + user + "'"
        });
        resolve();
      } else {
        reject();
      }
    }).catch((err) => {
      httpResponse.status(401);
      httpResponse.send('401, invalid user');
    });
  }
}