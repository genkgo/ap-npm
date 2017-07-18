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

  log(...messages) {
    messages.forEach(function (message) {
      console.log(message);
    });
  }

  info(...messages) {
    messages.forEach(function (message) {
      console.info(colors.info(message));
    });
  }

  warn(...messages) {
    messages.forEach(function (message) {
      console.warn(colors.warn(message));
    });
  }

  error(...messages) {
    messages.forEach(function (message) {
      console.error(colors.error(message));
    });
  }

  debug(...messages) {
    messages.forEach(function (message) {
      console.debug(colors.debug(message));
    });
  }

}