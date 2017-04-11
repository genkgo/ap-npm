export default class {

  constructor(auth) {
    this.auth = auth;
  }

  process(httpRequest, httpResponse) {
    let userInfo = {
      username: httpRequest.body.name,
      password: httpRequest.body.password,
      email: httpRequest.body.email,
      type: httpRequest.body.type
    };

    console.log(userInfo);

    let result = this.auth.userAdd(userInfo.username, userInfo.password, userInfo.email);

    if (result) {
      // httpResponse.sendStatus(201);
      httpResponse.send({
        ok: "you are authenticated as '" + userInfo.username + "'",
      });
    }
  }

}