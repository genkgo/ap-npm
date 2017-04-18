import js_sha from 'js-sha256';


export default class {

  constructor(auth) {
    this.auth = auth;
  }

  /*
  * First checks if user exists, if so -> login
  * If user doesn't exist -> try to create user
  */
  process(httpRequest, httpResponse) {
    let userInfo = {
      username: httpRequest.body.name,
      password: httpRequest.body.password,
      email: httpRequest.body.email,
      type: httpRequest.body.type
    };

    // Check if user exists
    let token = js_sha.sha256(userInfo.username) + js_sha.sha256(userInfo.password);

    if (this.auth.userExists(userInfo.username)) {
      let result = this.auth.userLogin(userInfo.username, userInfo.password, userInfo.email);

      if (result === true) {
        console.log("User logged in: " + userInfo.username + ', ' + userInfo.email);
        httpResponse.status(201);
        httpResponse.send({
          token: token
        });
      } else {
        httpResponse.status(404).send({
          Error: "authentication failed"
        });
      }
    }

    // User doesn't exist, try to create user
    else {
      if (this.auth.userAdd(userInfo.username, userInfo.password, userInfo.email)) {
        httpResponse.status(201);
        httpResponse.send({
          ok: "you are authenticated as '" + userInfo.username + "'",
          token: token
        });
        return;
      } else {
        httpResponse.status(400);
        httpResponse.send({
          Error: "could not login or create user"
        });
        return;
      }
    }

  }

}