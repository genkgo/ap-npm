export default class {

  constructor(auth) {
    this.auth = auth;
  }

  can(access) {
    return (req, res, next) => {
      this.auth.shouldBeAbleTo(access, req.params.package, req.headers.authorization)
        .catch(function () {
          res.status(401);
        })
        .then(function() {
          next();
        }
      );
    };
  }

}