import readJson from '../../src/storage/filesystem/utils/read-json';
import path from 'path';
const assert = require('chai').assert;

describe("JSON Reader", function () {
  it("parses a json file to object", function () {
    let jsonLocation = path.join(__dirname, '..', 'filesystem', 'test-storage', 'test-project', 'package.json');
    readJson(jsonLocation)
      .then(object => {
        assert.typeOf(object, 'object');
      });
  });
});