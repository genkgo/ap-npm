export default class {

  constructor(auth) {
    this.auth = auth;
  }

  can(access) {
    return (req, res, next) => {
      let shouldContinue = true;
      this.auth.shouldBeAbleTo(access, req.params.package, req.headers.authorization)
        .catch(() => {
          res.status(401);
          res.send("401, unauthorized");
          shouldContinue = false;
        })
        .then(function() {
          if (shouldContinue) { next(); }
        }
      );
    };
  }

}