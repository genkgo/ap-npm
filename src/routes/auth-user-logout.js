export default class {
  constructor(auth) {
    this.auth = auth;
  }

  process(httpRequest, httpResponse) {
    return new Promise((resolve) => {
      let token = httpRequest.headers.authorization.substr(7);
      this.auth.userLogout(token);

      httpResponse.status(200);
      httpResponse.send({
        ok: 'Logged out'
      });
      resolve();
    });
  }
}