export default class {
  constructor(auth) {
    this.auth = auth;
  }

  process(httpRequest, httpResponse, next) {
    if (!httpRequest.headers.authorization) {
      httpResponse.status(401);
      httpResponse.header('WWW-Authenticate', 'Basic realm=\"ap-npm\"');
      httpResponse.send('Unauthorized');
    } else {
      let userLogin = (new Buffer.from(httpRequest.headers.authorization.substr(6), 'base64')).toString('UTF-8');
      let userInfo = userLogin.split(':');
      let username = userInfo[0];
      let password = userInfo[1];

      this.auth.verifyLogin(username, password).then((loggedIn) => {
        if (loggedIn === true) {
          next();
        } else {
          httpResponse.status(401);
          httpResponse.send("Invalid username and password, unauthorized");
        }
      });
    }
  }
}