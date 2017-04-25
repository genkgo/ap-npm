import commander from 'commander';
import container from './init';
import config from './config';

commander
  .command('serve')
  .alias('s')
  .description('serve ap-npm')
  .option('--port [port]', "port to listen on")
  .option('--storage ["/location/to/storage"]', "storage location to use")
  .option('--ssl', 'use ssl')
  .option('--sslkey ["/location/to/ssl/key]', 'ssl key to use')
  .option('--sslcert ["/location/to/ssl/cert"]')
  .action(function(options) {

    if (options.storage) {
      config.storage.directory = options.storage;
    }
    if (options.port) {
      config.port = options.port;
    }
    if (options.ssl) {
      if (options.sslkey && options.sslcert) {
        config.ssl.enabled = true;
        config.ssl.key = options.sslkey;
        config.ssl.cert = options.sslcert;
      } else if (config.ssl.key && config.ssl.cert) {
        config.ssl.enabled = true;
        console.log("--sslkey, --sslcert not given, using config provided locations\n");
      } else {
        console.log(
          "please restart and specify a key and cert to use ssl\n" +
          "   --ssl\n" +
          "   --sslkey: ['/location/to/ssl/key']\n" +
          "   --sslcert: ['location/to/ssl/cert']\n");
      }
    }

    let command = container.get('command-serve');
    if (config.ssl.enabled === true) {
      console.log("ap-npm is listening on https://localhost:" + config.port + '\n');
    } else {
      console.log("ap-npm is listening on http://localhost:" + config.port + '\n');
    }
    command.run();
  });

commander.parse(process.argv);

if (!process.argv.length) {
  commander.outputHelp();
}