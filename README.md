# ap-npm
Authenticated Private  NPM Repository

ap-npm runs a npm-repository. 
It should be used together with [npm-scope](https://docs.npmjs.com/misc/scope), 
as ap-npm doesn't function as a caching/proxy server like Sinopia/Verdaccio. 

##### Install
```
npm install -g ap-npm
```

##### Start server
```
ap-npm serve
```
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
