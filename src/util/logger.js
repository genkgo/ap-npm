import colors from 'colors/safe';

export default class {

  constructor() {
    colors.setTheme({
      info: 'green',
      warn: 'yellow',
      error: 'red',
      debug: 'blue'
    });
  }

  routerLogger(req, res, next) {
    console.log("\nMETHOD:", req.method, ", URL:", decodeURIComponent(req.originalUrl));
    next();
  }

  log(message) {
    console.log(message);
  }

  info(message) {
    console.info(colors.info(message));
  }

  warn(message) {
    console.warn(colors.warn(message));
  }

  error(message) {
    console.error(colors.error(message));
  }

  debug(message) {
    console.debug(colors.debug(message));
  }

}