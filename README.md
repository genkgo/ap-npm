# ap-npm
Private Authenticated NPM Repository

ap-npm runs a server that acts as a private NPM-repository. It should be used together with [npm-scope](https://docs.npmjs.com/misc/scope), as ap-npm doesn't function as a caching/proxy server like Sinopia/Verdaccio. 

#### Requirements:
ap-npm has been tested with:
- npm: 3.10 or higher
- node: 6.10 or higher

#### Commands:
To start the server: `npm start <options>`

##### Options:

- `--serve` start listening
- `--port` overwrite used port

###### what works:
 - `npm install 'package'` serves the file requested (also works with @'scope' or --scope='scope')
 - `npm adduser/login` works with a local authentication method (we recommend implementing your own when using ap-npm)
 - `npm publish` stores the package in storage, package is immediately available through `npm install`
 - `npm dist-tag` functionality all works
 - `npm unpublish` works both with versions and --force
 
 ###### work in progress:
  - Implement methods like unpublish, deprecate
  - Implement route requests that are uncommon, but could be used
