import path from 'path';
import fse from 'fs-extra';

export default function (container) {

  let storageLocation = path.join(container.get('config').workDir, container.get('config').storage.directory);
  try {
    if (!fse.ensureDirSync(storageLocation)) {
      fse.mkdirsSync(storageLocation);
    }
  } catch (err) {
    container.get('logger').error("Failed to initialize filesystem-structure in " + storageLocation);
  }


  container.set('storage-filesystem', function () {
    let Filesystem = require('../storage/filesystem/index').default;
    return new Filesystem(container.get('config'), container.get('logger'));
  });

  container.set('storage', function () {
    return container.get('storage-filesystem');
  });
}