import Container from './util/container';
import StorageInit from './init/storage-init';
import RoutesInit from './init/routes-init';
import AuthInit from './init/auth-init';
import CommandInit from './init/command-init';
import UtilInit from './init/util-init';
import StorageCheck from './init/storage-check';

export default function(configFile) {
  let container = new Container();

  container.set('config', function() {
    return require(configFile);
  });

  StorageCheck(container);
  StorageInit(container);
  RoutesInit(container);
  AuthInit(container);
  CommandInit(container);
  UtilInit(container);

  return container;
}