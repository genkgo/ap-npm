# ap-npm
Private Authenticated NPM Repository

ap-npm runs a server that acts as a private NPM-repository. It should be used together with [npm-scope](https://docs.npmjs.com/misc/scope), as ap-npm doesn't function as a caching/proxy server like Sinopia/Verdaccio. 

## Usage:
### Commands:
To start the server: `npm start <options>`

#### Options:
- `--serve` start listening
- `--port` overwrite used port

##### To install package:
`npm install @myco/myPackage`
##### To login:
`npm login --registry=http://hostname:port --scope=@myco`
##### To logout:
`npm logout --scope=@myco`
##### Set registry:
`npm config set @myco:registry http://reg.example.com`
##### Set dependencies:
`"dependencies": {
   "@myorg/mypackage": "^1.3.0"
 }`
##### Requiring scoped packages:
`require('@myorg/mypackage')`

## Requirements:
ap-npm has been tested with:
- npm: 3.10 or higher
- node: 6.10 or higher

## Authentication

ap-npm has a simple local authentication method implemented, but we recommend anyone who uses this project to implement their own. There are 3 functions in `src/auth/index.js`: userLogin, userAdd and userRemove. userRemove doesn't do anything yet as it is not implemented in npm.
 
 userAdd and userLogin can be changed to anything you want. As long as the functions return true or false (so external authentication is also possible, which was one of the main reasons behind ap-npm).

## Progress
Everything should be working. If there is functionality in npm that isn't supported by ap-npm, please create an issue on Github.
