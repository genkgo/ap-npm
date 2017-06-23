# ap-npm
Authenticated Private  NPM Repository

ap-npm runs a npm-repository. 
It should be used together with [npm-scope](https://docs.npmjs.com/misc/scope), 
as ap-npm doesn't function as a caching/proxy server like Sinopia/Verdaccio.

Since 0.2.4 ap-npm has a proxy feature. If a package cannot be found locally, it will proxy the request over to the registry given in the config (**Note: by default this feature is turned off**)

#### Install
```
npm install -g ap-npm
```

##### Start server
```
ap-npm serve
```
##### List/change config
```
ap-npm config [prop] [value]
```
##### Setup npm project with ap-npm publishConfig
```
ap-npm init
```
This runs `npm init` in the current folder and adds a publishConfig to the package.json from your ap-npm config

## Dependencies
ap-npm has been tested with:
- npm: 3.10 or higher
- node: 6.10 or higher


### [ap-npm on Docker Hub](https://hub.docker.com/r/meirbon/ap-npm/)
### [Info on using ap-npm](https://github.com/genkgo/ap-npm/wiki)
- [Usage](https://github.com/genkgo/ap-npm/wiki/Usage)
- [Setting up Docker](https://github.com/genkgo/ap-npm/wiki/Using-Docker)
- [Setting up authentication](https://github.com/genkgo/ap-npm/wiki/Authentication)
- [Setting up ssl](https://github.com/genkgo/ap-npm/wiki/Using-SSL)
