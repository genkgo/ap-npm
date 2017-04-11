import commander from 'commander';
import container from './init';
import config from './config';

commander.option('-s, --serve', 'Serve the application');
commander.option('-p, --port', 'Port to listen on');
commander.parse(process.argv);

if (commander.port) {
  config.port = commander.port;
}

if (commander.serve) {
  let command = container.get('command-serve');
  command.run();
}