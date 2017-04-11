import Cookies from 'cookies';
import bodyParser from 'body-parser';
import Error from 'http-errors';
import Path from 'path';

export default function (app, container) {
  let logger = function(req, res, next) {
    console.log("REQUEST, URL:", req.originalUrl, '\n');
    next(); // Passing the request to the next handler in the stack.
  };
  app.use(logger);

  // TODO: are these necessary for something?
  // these can't be safely put into express url for some reason
  // app.param('_rev',             match(/^-rev$/));
  // app.param('org_couchdb_user', match(/^org\.couchdb\.user:/));
  // app.param('anything',         match(/.*/));


  app.use(bodyParser.json({ strict: false, limit: '10mb' }));

  // encode / in a scoped package name to be matched as a single parameter in routes
  app.use(function(req, res, next) {
    if (req.url.indexOf('@') !== -1) {
      // e.g.: /@org/pkg/1.2.3 -> /@org%2Fpkg/1.2.3, /@org%2Fpkg/1.2.3 -> /@org%2Fpkg/1.2.3
      req.url = req.url.replace(/^(\/@[^\/%]+)\/(?!$)/, '$1%2F')
    }
    next()
  });

  // for "npm whoami"
  app.get('/whoami', function(req, res, next) {
    if (req.headers.referer === 'whoami') {
      next({ username: req.remote_user.name })
    } else {
      next('route')
    }
  });

  // ? TODO
  app.get('/-/whoami', function(req, res, next) {
    next({ username: req.remote_user.name })
  });

  // Get version of package --- WORKING
  app.get('/:package/:version?', function(req, res, next) {
    let route = container.get('route-package-request');
    route.process(req, res);
    next();
  });

  // Publish package --- TODO
  app.put('/:package/:_rev?/:revision?', function(req, res, next) {
    let route = container.get('route-package-publish');
    route.process(req, res);
    next();
  });

  // Get dist-tags of package --- Working?
  app.get('/-/package/:package/dist-tags', function(req, res, next) {
    let route = container.get('route-package-get-dist-tags');
    route.process(req, res);
    next()
  });

  // Request for package file data --- WORKING
  app.get('/:package/-/:filename', function(req, res, next) {
    let route = container.get('route-package-get');
    route.process(req, res);
    next();
  });

  return app
}

