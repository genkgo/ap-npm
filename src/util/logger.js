export default class {

  routerLogger(req, res, next) {
    this.log("\nMETHOD:", req.method, ", URL:", decodeURIComponent(req.originalUrl));
    next();
  }

  log(message) {
    console.log(message);
  }

  info(message) {
    console.info(message);
  }

  warn(message) {
    console.warn(message);
  }

  error(message) {
    console.error(message);
  }

}