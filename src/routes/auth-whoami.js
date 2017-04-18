// THIS DOESN'T FUNCTION YET

export default class {

  constructor(auth) {
    this.auth = auth;
  }

  process(httpRequest, httpResponse) {
    // TODO: Do something with auth and with the token to verify user
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