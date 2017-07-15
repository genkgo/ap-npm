export default function(container) {
  container.set('command-serve', function () {
    let Command = require('../commands/serve').default;
    return new Command(container.get('express'), container.get('config'));
  });

  container.set('command-init', function () {
    let Command = require('../commands/init').default;
    return new Command();
  });

  container.set('command-config', function() {
    let Command = require('../commands/config').default;
    return new Command();
  });
}