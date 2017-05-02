import fs from 'fs';

export default function(container) {
  let config = container.get('config');
  let workDir = config.workDir;
  let storageDir = workDir + config.storage.directory;
  let authDir = workDir + '/db';
  let foldersToCheck = [storageDir, storageDir, authDir];
  let filesToCheck = [authDir + '/user_tokens.json'];
  if (config.auth.adapter === "/auth/json-db") {
    filesToCheck.push(authDir + '/user_db.json');
  }

  for (let i = 0; i < foldersToCheck.length; i++) {
    let folder = foldersToCheck[i];
    if (!fs.existsSync(folder)) {
      try {
        fs.mkdirSync(folder, '0777');
      } catch (err) {
        console.log("Could not create folder: " + folder);
        console.log(err);
        console.log('\n');
      }
    }
  }

  for (let i = 0; i < filesToCheck.length; i++) {
    let file = filesToCheck[i];
    if (!fs.existsSync(file)) {
      try {
        fs.writeFileSync(file, JSON.stringify({}), {options: {encoding: 'utf8', mode: '0777'}})
      } catch (err) {
        console.log("Could not create file: " + file);
        console.log(err);
        console.log('\n');
      }
    }
  }
}