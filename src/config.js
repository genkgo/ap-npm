export default {

  "workDir": "/ap-npm",

  "storage": {
    "name": "filesystem",
    "directory": "/ap-npm/storage"
  },

  "port": 4444,

  /*
  * 'register': set availability of user-registration
  * 'public': make everything publicly available
  * 'remove': make it possible to remove, unpublish or overwrite packages
  */
  "auth": {
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
    "key": "/ap-npm/ssl/sslkey.key",
    "cert": "/ap-npm/ssl/sslcert.crt"
  }
}