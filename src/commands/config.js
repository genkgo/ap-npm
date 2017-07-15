import fs from 'fs';
import path from 'path';

export default class {

  /**
   * @param {Logger} logger logger class
   */
  constructor(logger) {
    this.configPath = path.join(__dirname, '../..', 'config.json');
    this.logger = logger;
  }

  listConfig(configLocation) {
    this.logger.log('Config location: ' + configLocation);
    fs.readFile(configLocation, (err, configData) => {
      this.logger.log("Config:\n", JSON.parse(configData));
    });
  }

  updateProp(property, value) {
    return new Promise((resolve, reject) => {
      let propArgs = property.split('.');

      fs.readFile(this.configPath, (err, file) => {
        if (err) {
          reject("Could not update config:" + err);
          return 1;
        }

        let config = JSON.parse(file);
        switch (propArgs.length) {
          case 1:
            if (config.hasOwnProperty(propArgs[0]) && typeof config[propArgs[0]] !== 'object') {
              config[propArgs[0]] = this.convertValue(value);
              break;
            }
            reject("Unknown property: " + property);
            break;
          case 2:
            if (config.hasOwnProperty(propArgs[0])) {
              if (config[propArgs[0]]
                .hasOwnProperty(propArgs[1]) &&
                typeof config[propArgs[0]][propArgs[1]] !== 'object'
              ) {
                config[propArgs[0]][propArgs[1]] = this.convertValue(value);
                break;
              }
            }
            reject("Unknown property: " + property);
            break;
          case 3:
            if (config.hasOwnProperty(propArgs[0])) {
              if (config[propArgs[0]]
                .hasOwnProperty(propArgs[1])
              ) {
                if (config[propArgs[0]][propArgs[1]]
                  .hasOwnProperty(propArgs[2])
                ) {
                  config[propArgs[0]][propArgs[1]][propArgs[2]] = this.convertValue(value);
                  break;
                }
              }
              reject("Unknown property: " + property);
            }
            reject("Unknown property: " + property);
            break;
          default:
            reject("Unknown property: " + property);
        }

        fs.writeFile(this.configPath, JSON.stringify(config, null, 2), () => {
          reject("Property: '" + property + "' has been updated: " + value);
          resolve(0);
        });
      });
    }).catch(err => this.logger.log(err));
  }

  convertValue(value) {
    if (value === 'true') {
      return true;
    } else if (value === 'false') {
      return false;
    } else if (!isNaN(value)) {
      return parseInt(value, 10);
    }
    return value;
  }

}
