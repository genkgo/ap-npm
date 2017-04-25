# ap-npm
Private Authenticated NPM Repository

ap-npm runs a server that acts as a private NPM-repository. 
It should be used together with [npm-scope](https://docs.npmjs.com/misc/scope), 
as ap-npm doesn't function as a caching/proxy server like Sinopia/Verdaccio. 

## Usage:
`npm start -- <command> <options>`

#### Commands
- `serve | s` start listening
     - `--port` overwrite used port
     - `--storage` overwrite storage location
     - `--ssl` enable ssl
        - `--sslkey` overwrite ssl key location
        - `--sslcert` overwrite ssl cert location

(Note: above options can also be set in /src/config.js)

##### To publish a package:
`npm publish --registry=http://hostname:port`

Note: `npm publish @myco/myPackage` won't work as 
it will try to publish the package to https://registry.npmjs.org/
##### To install a package:
`npm install @myco/myPackage`
##### To login:
`npm login --registry=http://hostname:port --scope=@myco`

Note: `npm login` is an alias for `npm adduser`
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

## ssl configuration:
Specify a key and certificate file in `src/config/js` when ssl 
is used ap-npm will only be accessible through https.
If ap-npm fails to use read or use the ssl files, it 
will default back to http.

## Using Docker:
Setup the config in `src/config/js` any way you like, run the following command to build the image:

`docker build -t ap-npm .`

Run the following command to start your image:

`docker run -p <port>:4444 -d ap-npm`

To test if ap-npm is running:

`curl http://localhost:<port>` 

should return: 

`ap-npm is running`

## Authentication
ap-npm has a simple local authentication method implemented, 
but we recommend anyone who uses this project to implement their own. 
There are 3 functions in `src/auth/index.js`: userLogin, userAdd and userRemove. 
userRemove doesn't do anything yet as it is not implemented in npm.

userAdd and userLogin can be changed to anything you want. 
As long as the functions return true or false (so external 
authentication is also possible, 
which was one of the main reasons behind ap-npm).

## Progress
Everything should be working. If there is functionality in npm that isn't 
supported by ap-npm, please create an issue on Github.
