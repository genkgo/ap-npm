import Container from './util/container';
import config from './config';

let container = new Container();

//    *** STORAGE ***
container.set('local-storage-filesystem', function () {
  let Filesystem = require('./storage/filesystem/index').default;
  return new Filesystem(config.storage.directory);
});

container.set('local-storage-couch', function () {
  return require('./storage/filesystem/index');
});

container.set('local-storage', function () {
  return container.get('local-storage-' + config.storage.name);
});

//    *** ROUTE ***
container.set('route-package-version', function () {
  let Route = require('./routes/package-version').default;
  let Versioner = require('./package/versioner').default;
  return new Route(new Versioner(), container.get('local-storage'));
});


// *** COMMANDS
container.set('command-serve', function () {
  let Command = require('./commands/serve').default;
  return new Command(container.get('express'));
});


//    *** UTILS
container.set('remote-registry', function () {
  let Route = require('./routes/add-user').default;
  return new Route();
});

container.set('express', function () {
  let express = require('express');
  let routes = require('./routes').default;
  let app     = express();
  app.set('env', process.env.NODE_ENV || 'production');
  routes(app, container);
  return app;
});

export default container;