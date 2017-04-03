import Container from 'container';
import config from 'config';

let container = new Container();

container.set('storage-filesystem', function () {
  let Filesystem = require('storage/filesystem/index');
  return new Filesystem(config.storage.directory);
});

container.set('storage-couch', function () {
  return require('storage/filesystem/index');
});

container.set('route-add-user', function () {
  let Route = require('routes/add-user');
  return new Route();
});

container.set('route-get-package', function () {
  let Route = require('routes/get-package');
  return new Route(container.get('local-storage'), container.get('remote-registry'));
});

container.set('route-remove-package', function () {
  let Route = require('routes/remove-package');
  return new Route(container.get('local-storage'), container.get('remote-registry'));
});

container.set('remote-registry', function () {
  let Route = require('routes/add-user');
  return new Route();
});

container.set('local-storage', function () {
  return container.get('storage-' + config.storage.name);
});