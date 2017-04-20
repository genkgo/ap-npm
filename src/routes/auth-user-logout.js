import fs from 'fs';
import path from 'path';

export default class {
  constructor(auth) {
    this.auth = auth;
  }

  process(httpRequest, httpResponse) {
    let token = httpRequest.headers.authorization.substr(7);
    this.auth.userLogout(token);

    httpResponse.status(200);
    httpResponse.send({
      ok: 'Logged out'
    });
  }
}