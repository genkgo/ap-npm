import path from 'path';

export default {
  "workDir": path.join(__dirname, 'filesystem'),
  "storage": {
    "directory": path.join(this.workDir, 'test-storage')
  },
  "port": 4444,
  "hostname": "localhost",
  "proxyEnabled": false,
  "proxyUrl": "https://registry.npmjs.org",
  "auth": {
    "adapter": path.join(__dirname, 'mocks', 'authMock.js'),
    "users": {
      "canPublish": true,
      "canAccess": true
    },
    "register": true,
    "public": false,
    "remove": true
  },
  "ssl": {
    "enabled": true,
    "key": "/ssl/sslkey.key",
    "cert": "/ssl/sslcert.crt"
  }
}
