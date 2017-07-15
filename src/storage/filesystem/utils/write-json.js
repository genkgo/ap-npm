import fs from 'fs';

/**
 * @param {String} jsonLocation location of json
 * @param {Object} jsonData json-object
 * @return {Boolean} json written
 */
export default function (jsonLocation, jsonData) {
  return new Promise((resolve) => {
    fs.writeFileSync(jsonLocation, JSON.stringify(jsonData, null, 2), {'mode': '0777'});
    resolve(true);
  });
}