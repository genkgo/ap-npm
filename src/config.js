export default {

  "storage": {
    "name": "filesystem",
    "directory": "/workspace/testStorage"
  },

  "hostname": "http://localhost",
  "port": 4321,

  /*
  * 'register': set availability of user-registration
  * 'public': make packages publicly available
  */
  "auth": {
    "register": false,
    "public": false,
    "remove": false
  }

}