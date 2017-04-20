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
    try {
      user = this.auth.verifyToken(token);
    } catch (err) {
      // User not valid
      httpResponse.status(401);
      httpResponse.send('401, invalid user');
      return;
    }

    // User valid
    httpResponse.send({
      username: "you are logged in as '" + userInfo + "'"
    });
  }

}