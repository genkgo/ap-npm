import bodyParser from 'body-parser';
import Access from './auth/access';

export default function (app, container) {
  let logger = function(req, res, next) {
    console.log("METHOD:", req.method, ", URL:", decodeURIComponent(req.originalUrl), '\n');
    next(); // Passing the request to the next handler in the stack.
  };

  let access = new Access(container.get('auth'));

  app.use(logger);
  app.use(bodyParser.json({ strict: false, limit: '10mb' }));

  // Rewrite the requested url when a scoped package is used
  app.use(function(req, res, next) {
    let url;

    // In case a simple request is send
    if (req.url[1] === '@') {
      url = decodeURIComponent(req.url);
      let packageName = url.lastIndexOf('/') + 1;
      req.url = '/' + encodeURIComponent(url.substr(packageName));

    }

    // In case a dist-tags like request is send
    else {
      url = req.url;
      if (url.indexOf('@') > -1) {
        let urlSlices = url.split('/');
        let index;
        for (let i = 0; i < urlSlices.length; i++) {
          if (urlSlices[i].indexOf('@') > -1) {index = i;}
        }

        let scopedUrl = decodeURIComponent(urlSlices[index]);
        urlSlices[index] = scopedUrl.substr(scopedUrl.indexOf('/') + 1);
        let newUrl = "";
        for (let i = 1; i < urlSlices.length; i++) {
          newUrl +=  '/' + urlSlices[i];
        }
        req.url = decodeURIComponent(newUrl);
      }
    }
    next();
  });

  // Rewrite ? params to req.params and convert url into regular url
  app.use(function(req, res, next) {
    let url = decodeURIComponent(req.url);
    let params = url.split('?');
    for (let i = 1; i < params.length; i++) {
      let param = params[i].split('=');
      req.params[param[0]] = param[1];
    }
    req.url = params[0];
    next();
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
  // Get version of package
  app.get('/:package/:version?', access.can('access'), function(req, res, next) {
    let route;
    if (req.params.write) {
      route = container.get('route-package-unpublish');
    } else {
      route = container.get('route-package-request');
    }
    route.process(req, res);
  });
  // Request for package file data
  app.get('/:package/-/:filename', access.can('access'), function(req, res, next) {
    let route = container.get('route-package-get');
    route.process(req, res);
  });

  // *** DIST-TAGS ***
  app.get('/-/package/:package/dist-tags', access.can('access'), function(req, res, next) {
    let route = container.get('route-package-get-dist-tags');
    route.process(req, res);
  });
  app.delete('/-/package/:package/dist-tags/:tag', access.can('publish'), function(req, res, next) {
    let route = container.get('route-package-delete-dist-tags');
    route.process(req, res);
  });
  app.put('/-/package/:package/dist-tags/:tag', access.can('publish'), function(req, res, next) {
    let route = container.get('route-package-add-dist-tags');
    route.process(req, res);
  });


  // *** PUBLISH ***
  app.put('/:package/:_rev?/:revision?', access.can('publish'), function(req, res, next) {
    let route = container.get('route-package-publish');
    route.process(req, res);
  });

  app.delete('/:package/:_rev?/:revision?', access.can('publish'), function(req, res, next) {
    let route = container.get('route-package-delete');
    route.process(req, res);
  });


  return app
}

