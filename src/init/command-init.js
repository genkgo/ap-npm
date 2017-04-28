export default function(container) {
  container.set('command-serve', function () {
    let Command = require('../commands/serve').default;
    return new Command(container.get('express'), container.get('config'));
  });
}