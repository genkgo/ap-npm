import fs from 'fs';
import path from 'path';

export default class {

  constructor(hostname, port, ssl) {
    this.hostname = hostname;
    this.port = port;
    this.ssl = ssl;
    this.configPath = path.join(__dirname, '../..', 'config.json');
  }

  listConfig(configLocation) {
    console.log('Config location: ' + configLocation);
    fs.readFile(configLocation, (err, configData) => {
      console.log("Config:\n", JSON.parse(configData));
    });
  }

  updateProp(property, value) {
    let propArgs = property.split('.');

    fs.readFile(this.configPath, (err, file) => {
      if (err) {
        console.log("Could not update config:" + err);
        return 1;
      }

      let config = JSON.parse(file);
      switch (propArgs.length) {
        case 1:
          if (config.hasOwnProperty(propArgs[0])) {
            config[propArgs[0]] = this.convertValue(value);
            break;
          }
          console.log("Unknown property: " + property);
          return 2;
        case 2:
          if (config.hasOwnProperty(propArgs[0])) {
            if (config[propArgs[0]]
              .hasOwnProperty(propArgs[1])
            ) {
              config[propArgs[0]][propArgs[1]] = this.convertValue(value);
              break;
            }
          }
          console.log("Unknown property: " + property);
          return 2;
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
          }
          console.log("Unknown property: " + property);
          return 2;
        default:
          console.log("Unknown property: " + property);
          return 2;
      }

      fs.writeFile(this.configPath, JSON.stringify(config, null, 2), () => {
        console.log("Property: '" + property + "' has been updated: " + value);
      });
    });
  }

  convertValue(value) {
    if (value === 'true') {
      return true;
    } else if (value === 'false') {
      return false;
    }
    return value;
  }

}
