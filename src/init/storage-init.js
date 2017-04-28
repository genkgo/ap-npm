export default function(container) {
  container.set('storage-filesystem', function () {
    let Filesystem = require('../storage/filesystem/index').default;
    return new Filesystem(container.get('config'));
  });

  container.set('storage-couch', function () {
    return require('../storage/filesystem/index');
  });

  container.set('storage', function () {
    return container.get('storage-filesystem');
  });
}