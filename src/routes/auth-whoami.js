export default class {

  constructor(auth) {
    this.auth = auth;
  }

  // First try to login the user, then try to create if login
  process(httpRequest, httpResponse) {
    console.log(httpRequest);

    // let userInfo = {
    //   username: httpRequest.body.name,
    //   password: httpRequest.body.password,
    //   email: httpRequest.body.email,
    //   type: httpRequest.body.type
    // };

    httpResponse.status(201);
    httpResponse.send({
      username: httpRequest.body.name,
      ok: "ok"
    })
  }

}