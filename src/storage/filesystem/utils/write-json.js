import fs from 'fs';

export default function (jsonLocation, jsonData) {
  return new Promise((resolve) => {
    fs.writeFileSync(jsonLocation, JSON.stringify(jsonData, null, 2), {'mode': '0777'});
    resolve(true);
  });
}