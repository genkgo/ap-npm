import Cookies from 'cookies';
import bodyParser from 'body-parser';
import Error from 'http-errors';
import Path from 'path';

export default function (app, container) {
  let logger = function(req, res, next) {
    console.log("REQUEST, METHOD:", req.method, ", URL:", req.originalUrl, '\n');
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
    // next({ username: req.remote_user.name })
    let route = container.get('route-auth-whoami');
    route.process(req, res);
    next();
  });

  // Get version of package --- WORKING
  app.get('/:package/:version?', function(req, res, next) {
    let route = container.get('route-package-request');
    route.process(req, res);
    next();
  });

  // // Publish package --- TODO: This is also getting used when logging in
  // app.put('/:package/:_rev?/:revision?', function(req, res, next) {
  //   console.log("publish used");
  //   let route = container.get('route-package-publish');
  //   route.process(req, res);
  //   next();
  // });

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

  app.get('/-/user/:org_couchdb_user', function(req, res, next) {
    console.log("get AUTH");
    res.status(200);
    next({
      ok: 'you are authenticated as "' + req.remote_user.name + '"',
    })
  });


  // *** AUTH ***
  // Add user
  app.put('/-/user/org.couchdb.user:_rev?/:revision?', function(req, res, next) {
    console.log("put AUTH");
    let route = container.get('route-auth-user-add')
    route.process(req, res);
    next();
  });

  // app.put('/-/user/:org_couchdb_user/:_rev?/:revision?', function(req, res, next) {
  //   var token = (req.body.name && req.body.password)
  //     ? auth.aes_encrypt(req.body.name + ':' + req.body.password).toString('base64')
  //     : undefined
  //   if (req.remote_user.name != null) {
  //     res.status(201)
  //     return next({
  //       ok: "you are authenticated as '" + req.remote_user.name + "'",
  //       //token: auth.issue_token(req.remote_user),
  //       token: token,
  //     })
  //   } else {
  //     if (typeof(req.body.name) !== 'string' || typeof(req.body.password) !== 'string') {
  //       if (typeof(req.body.password_sha)) {
  //         return next( Error[422]('your npm version is outdated\nPlease update to npm@1.4.5 or greater.\nSee https://github.com/rlidwka/sinopia/issues/93 for details.') )
  //       } else {
  //         return next( Error[422]('user/password is not found in request (npm issue?)') )
  //       }
  //     }
  //     auth.add_user(req.body.name, req.body.password, function(err, user) {
  //       if (err) {
  //         if (err.status >= 400 && err.status < 500) {
  //           // With npm registering is the same as logging in,
  //           // and npm accepts only an 409 error.
  //           // So, changing status code here.
  //           return next( Error[409](err.message) )
  //         }
  //         return next(err)
  //       }
  //
  //       req.remote_user = user
  //       res.status(201)
  //       return next({
  //         ok: "user '" + req.body.name + "' created",
  //         //token: auth.issue_token(req.remote_user),
  //         token: token,
  //       })
  //     })
  //   }
  // })


  // Logout
  // app.delete('/-/user/token/*', function(req, res, next) {
  //
  //   res.status(200);
  //   next({
  //     ok: 'Logged out',
  //   })
  // });

  return app
}

