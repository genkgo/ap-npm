export default class {

  constructor(auth) {
    this.auth = auth;
  }

  process(httpRequest, httpResponse) {
    return new Promise((resolve, reject) => {
      let token = httpRequest.headers.authorization.substr(7);
      let user = this.auth.verifyToken(token);

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
      httpResponse.send('Invalid user');
    });
  }
}