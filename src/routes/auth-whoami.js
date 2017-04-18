// THIS DOESN'T FUNCTION YET

export default class {

  constructor(auth) {
    this.auth = auth;
  }

  // TODO: Do something with auth and with the token to verify user
  /*
  * npm whoami sends its token to the server and requests a username
  * This route verifies which user is logged in and sends back its username
  */
  process(httpRequest, httpResponse) {
    let token = httpRequest.headers['authorization'].substr(7);
    console.log("whoami", {
      "npm-token": token
    });

    let userInfo = this.auth.verifyToken(token);

    httpResponse.send({
      username: "You are logged in as '" + userInfo + "'"
    });
  }

}