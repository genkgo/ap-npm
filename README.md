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

###### Progress of ap-npm
Everything should be working. If there is functionality in npm that isn't supported by ap-npm, please create an issue on Github.
