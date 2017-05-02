import fs from 'fs';
import path from 'path';

export default class {

  constructor(hostname, port, ssl) {
    this.hostname = hostname;
    this.port = port;
    this.ssl = ssl;

    this.mutableProperties = {
      "workDir": 'string',
      "port": 'integer',
      "hostname": 'string',
      "ssl": 'boolean',
      "sslkey": "string",
      "sslcert": "string"
    }
  }

  run(property, value) {
    let configPath = path.join(__dirname, '../..', 'config.json');
    let configString = fs.readFileSync(configPath);
    let config = JSON.parse(configString);

    if (config.hasOwnProperty(property) !== true) {
      console.log("Error, property does not exist");
      return;
    } else if (this.mutableProperties.hasOwnProperty(property) !== true) {
      console.log("Error, cannot change this property from cli\n" +
        "changing all properties should be done using a config file");
      return;
    }

    // Convert values
    if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      value = false;
    }

    if (typeof value !== this.mutableProperties[property]) {
      console.log("Value is incorrect, aborting\n");
      return;
    }

    if (property === 'ssl') {
      config.ssl.enabled = value;
    }
    else if (property === 'sslkey') {
      config.ssl.sslkey = value;
    }
    else if(property === 'sslcert') {
      config.ssl.sslcert = value;
    }

    else {
      config[property] = value;
    }

    fs.writeFile(configPath, JSON.stringify(config, null, 2), () => {
      console.log("Property: '"+ property + "' has been updated: " + value);
    });

  }

}
