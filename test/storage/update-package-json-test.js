import path from 'path';
import fs from 'fs';
import fse from 'fs-extra';
import updatePackageJson from '../../src/storage/filesystem/utils/update-packagejson';

const expect = require('chai').expect;
const packageName = 'test-project';
const tmpLocation = path.join(__dirname, '..', 'filesystem', 'tmp');
const tmpJsonLocation = path.join(tmpLocation, packageName, 'package.json');
const packageJsonLocation = path.join(__dirname, '..', 'filesystem', 'test-storage', packageName, 'package.json');

if (!fse.ensureDirSync(tmpLocation)) {
  fse.mkdirsSync(tmpLocation);
} else {
  fse.emptyDirSync(tmpLocation);
}
fse.copySync(packageJsonLocation, tmpJsonLocation);


describe('Storage updatePackageJson', function () {

  it('should update a package.json', function () {
    let json = JSON.parse(fs.readFileSync(tmpJsonLocation));
    json._id = "modified";

    updatePackageJson({
      name: packageName
    }, json, tmpLocation).then(() => {
      fs.readFile(tmpJsonLocation, function (err, file) {
        if (err) {
          throw new Error("updatePackageJson failed");
        }

        expect(JSON.parse(file)).to.equal(json);
      })
    });
  });

});