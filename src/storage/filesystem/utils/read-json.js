import fs from 'fs';

export default function (jsonLocation) {
  return JSON.parse(fs.readFileSync(jsonLocation));
}