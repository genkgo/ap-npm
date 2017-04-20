import bodyParser from 'body-parser';
import Access from './auth/access';

export default function (app, container) {
  let logger = function(req, res, next) {
    console.log("METHOD:", req.method, ", URL:", req.originalUrl, '\n');
    next(); // Passing the request to the next handler in the stack.
  };

  let access = new Access(container.get('auth'));

  app.use(logger);
  app.use(bodyParser.json({ strict: false, limit: '10mb' }));

  // encode / in a scoped package name to be matched as a single parameter in routes
  app.use(function(req, res, next) {
    if (req.url.indexOf('@') !== -1) {
      // e.g.: /@org/pkg/1.2.3 -> /@org%2Fpkg/1.2.3, /@org%2Fpkg/1.2.3 -> /@org%2Fpkg/1.2.3
      req.url = req.url.replace(/^(\/@[^\/%]+)\/(?!$)/, '$1%2F')
    }
    next()
  });

  // *** AUTH ***
  app.put('/-/user/org.couchdb.user:_rev?/:revision?', function(req, res, next) {
    let route = container.get('route-auth-user-login');
    route.process(req, res);
  });
  // Logout
  app.delete('/-/user/token/*', function(req, res, next) {
    let route = container.get('route-auth-user-logout');
    route.process(req, res);
  });
  // for "npm whoami"
  app.get('/whoami', function(req, res, next) {
    let route = container.get('route-auth-whoami');
    route.process(req, res);
  });
  // for "npm whoami"
  app.get('/-/whoami', function(req, res, next) {
    let route = container.get('route-auth-whoami');
    route.process(req, res);
  });



  // *** INSTALL ***
  // Get version of package --- WORKING
  app.get('/:package/:version?', access.can('access'), function(req, res, next) {
    let route = container.get('route-package-request');
    route.process(req, res);
  });
  // Get dist-tags of package --- Working?
  app.get('/-/package/:package/dist-tags', function(req, res, next) {
    let route = container.get('route-package-get-dist-tags');
    route.process(req, res);
  });
  // Request for package file data --- WORKING
  app.get('/:package/-/:filename', access.can('access'), function(req, res, next) {
    let route = container.get('route-package-get');
    route.process(req, res);
  });


  // *** PUBLISH ***
  // TODO: We have to route the ?write=true route seperately for support for `npm deprecate` && `npm unpublish`
  app.put('/:package/:_rev?/:revision?', function(req, res, next) {
    let route = container.get('route-package-publish');
    route.process(req, res);
  });

  return app
}

