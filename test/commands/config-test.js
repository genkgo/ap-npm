import configCommand from '../../src/commands/config';
import loggerMock from '../mocks/loggerMock';
import fs from 'fs';
import path from 'path';

const logger = new loggerMock();
const expect = require('chai').expect;
const configLocation = path.join(__dirname, '../../config.json');

describe("Command config", function () {

  it('should set a singly deep setting', function () {
    fs.readFile(configLocation, (err, file) => {
      let config = JSON.parse(file);
      let command = new configCommand(logger);

      let setting = 'port';
      let oldValue = config[setting];
      let value = '4443';

      command.updateProp(setting, value).then(() => {
        config = JSON.parse(fs.readFileSync(configLocation));
        expect(config.port).to.equal(4443);
      });
      command.updateProp(setting, oldValue).then(Promise.resolve());
    });
  });

  it('should set nested settings', function () {
    fs.readFile(configLocation, (err, file) => {
      let config = JSON.parse(file);
      let command = new configCommand(logger);

      let setting = 'ssl.enabled';
      let oldValue = config.ssl.enabled;
      let value = 'true';

      command.updateProp(setting, value).then(() => {
        config = JSON.parse(fs.readFileSync(configLocation));
        expect(config.port).to.equal(value);
      });
      command.updateProp(setting, oldValue).then(() => {
        fs.readFile(configLocation, (err, file) => {
          let config = JSON.parse(file);
          let command = new configCommand(logger);

          let setting = 'auth.users.canPublish';
          let oldValue = config.auth.users.canPublish;
          let value = 'false';

          command.updateProp(setting, value).then(() => {
            config = JSON.parse(fs.readFileSync(configLocation));
            expect(config.port).to.equal(value);
          });
          return command.updateProp(setting, oldValue).then(Promise.resolve());
        });
      });
    });
  });

  it("should not set non-existent settings", function () {
    let command = new configCommand(logger);
    fs.readFile(configLocation, (err) => {
      expect(!err).to.equal(true);
      command.updateProp('i.donot.exist', true).then((result) => {
        expect(result).to.equal(2);
      });
    });
  });

});