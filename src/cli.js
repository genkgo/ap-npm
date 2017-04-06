import commander from 'commander';
import container from './init';

commander.option('-s, --serve', 'Serve the application');
commander.parse(process.argv);

if (commander.serve) {
  let command = container.get('command-serve');
  command.run();
}