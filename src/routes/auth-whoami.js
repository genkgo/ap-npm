export default class {

  constructor(auth) {
    this.auth = auth;
  }

  /*
  * npm whoami sends its token to the server and requests a username
  * This route verifies which user is logged in and sends back its username
  */
  process(httpRequest, httpResponse) {
    let token = httpRequest.headers['authorization'].substr(7);

    let userInfo = this.auth.verifyToken(token);

    if (userInfo === false) {
      // User not valid
      httpResponse.status(401);
      httpResponse.send({
        err: 'invalid user'
      });
    } else {
      httpResponse.send({
        username: "you are logged in as '" + userInfo + "'"
      });
    }
  }

}