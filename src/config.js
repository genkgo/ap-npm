export default {

  "storage": {
    "name": "filesystem",
    "directory": "/workspace/testStorage"
  },

  "hostname": "http://localhost",
  "port": 4321,

  /*
  * 'register': set availability of user-registration
  * 'public': make everything publicly available
  */
  "auth": {
    "users": {
      "canPublish": true,
      "canAccess": true
    },
    "register": true,
    "public": false,
    "remove": false
  }
}