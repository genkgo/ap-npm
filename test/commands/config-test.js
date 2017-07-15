import configCommand from '../../src/commands/config';
import md5 from 'md5';
import fs from 'fs';
import path from 'path';

const expect = require('chai').expect;
const configLocation = path.join(__dirname, '../../config.json');

describe("Command config", function () {
  it("should not set non-existent settings", function () {
    let config = JSON.parse(fs.readFileSync(configLocation));
    let command = new configCommand();

    fs.readFile(configLocation, (err, file) => {
      expect(!err).to.equal(true);

      let config = JSON.parse(file);
      expect(command.updateProp('i.donot.exist', true)).to.equal(2);
    });
  });
});