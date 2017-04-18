export default class {

  constructor(auth) {
    this.auth = auth;
  }

  // First try to login the user, then try to create if login
  process(httpRequest, httpResponse) {
    let userInfo = {
      username: httpRequest.body.name,
      password: httpRequest.body.password,
      email: httpRequest.body.email,
      type: httpRequest.body.type
    };
    console.log(userInfo);

    // Check if user exists
    let userExists = this.auth.userExists(userInfo.username);
    let userLogin = this.auth.userLogin(userInfo.username, userInfo.password, userInfo.email);

    // TODO: We have to give npm some kind of token to make it easy for us to check if user is logged in
    let token = "valid";

    console.log({
      "UserExists": userExists,
      "UserLogin": userLogin
    });

    if (userExists) {
      if (this.auth.userLogin(userInfo.username, userInfo.password, userInfo.email)) {
        httpResponse.status(201);
        httpResponse.send({
          token: token
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
      } else {
        httpResponse.status(400);
        httpResponse.send({
          Error: "could not login or create user"
        });
      }
    }

  }

}