import fs from 'fs';
import path from 'path';

export default class {
  constructor(auth) {
    this.auth = auth;
  }

  process(httpRequest, httpResponse) {
    let token = httpRequest.headers.authorization.substr(7);
    this.logout(token);

    httpResponse.status(200);
    httpResponse.send({
      ok: 'Logged out'
    });
  }

  logout(token) {
    let tokenLocation = path.join(__dirname, '../..', 'db', 'user_tokens.json');
    let allTokens;

    try {
      let tokenString = fs.readFileSync(tokenLocation, 'utf8');
      allTokens = JSON.parse(tokenString);
      delete allTokens[token];
    } catch (e) {
      // Just make the tokens_db an empty db.
      allTokens = {};
    }

    fs.writeFileSync(tokenLocation, JSON.stringify(allTokens, null, 2));
  }
}