import Container from './util/container';

import StorageInit from './init/storage-init';
import RoutesInit from './init/routes-init';
import AuthInit from './init/auth-init';
import CommandInit from './init/command-init';
import UtilInit from './init/util-init';


export default function(configFile) {
  let container = new Container();

  container.set('config', function() {
    return require(configFile);
  });

  StorageInit(container);
  RoutesInit(container);
  AuthInit(container);
  CommandInit(container);
  UtilInit(container);

  return container;
}