import fs from 'fs';

export default function (jsonLocation, jsonData) {
  fs.writeFileSync(jsonLocation, JSON.stringify(jsonData, null, 2), {'mode': '0777'});
}