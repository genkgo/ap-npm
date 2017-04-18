##### State of ap-npm
ap-npm is in a somewhat usable state, but expect quite some bugs and some functionality not working yet.

###### what works:
 - `npm install 'package'` serves the file requested
 - `npm adduser/login` is processed, but doesn't actually do much yet
 - `npm publish` stores the package in storage, package is immediately available through `npm install` (note: advanced features like `publish --tag` or `npm dist-tag add` are not implemented yet)  

###### work in progress:
 - Fully implement authentication
 - Implement route requests that are uncommon, but could be used

# ap-npm
Private Authenticated NPM Repository

ap-npm runs a server that acts as a private NPM-repository. It should be used together with [npm-scope](https://docs.npmjs.com/misc/scope), as ap-npm doesn't function as a caching/proxy server like Sinopia/Verdaccio. 

##### Requirements:
ap-npm is designed to be used with:
- npm: 3.10 or higher
- node: 6.10 or higher

##### Commands:
To start the server: `npm start --serve`
