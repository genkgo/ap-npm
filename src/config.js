export default {

  "storage": {
    "name": "filesystem",
    "directory": "/workspace/testStorage"
  },

  "port": 4321,

  /*
  * 'register': set availability of user-registration
  * 'public': make everything publicly available
  * 'remove': make it possible to remove, unpublish or overwrite packages *** not implemented yet
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
    "enabled": false,
    "key": "",
    "cert": ""
  }
}