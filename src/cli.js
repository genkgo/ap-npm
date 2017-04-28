import commander from 'commander';
import containerInit from './init';
import fs from 'fs';
import path from 'path';

commander
  .command('serve')
  .alias('s')
  .description('serve ap-npm')
  .option('--config', "config file to use")
  .action(function(config) {
    let container;
    if (fs.existsSync(config)) {
      console.log("using config: " + config + '\n');
      container = containerInit(config);
    }
    else if (fs.existsSync(path.join(__dirname, '../', config))) {
      let configLocation = path.join(__dirname, '../', config);
      console.log("using config: " + configLocation + '\n');
      container = containerInit(configLocation);
    }
    else {
      console.log("using default config\n");
      container = containerInit("../config.json");
    }

    let command = container.get('command-serve');
    command.run();
  });

commander.parse(process.argv);

if (!process.argv.length) {
  commander.outputHelp();
}