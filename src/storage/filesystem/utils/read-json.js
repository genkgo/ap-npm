import fs from 'fs';

export default function (jsonLocation) {
  return new Promise((resolve) => {
    fs.readFile(jsonLocation, (err, data) => {
      resolve(JSON.parse(data));
    });
  });
}