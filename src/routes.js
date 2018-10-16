import bodyParser from 'body-parser';
import Access from './auth/access';
import requestParser from './util/request-parser';
import paramParser from './util/param-parser';

export default function (app, container) {
  let access = new Access(container.get('auth'));
  let logger = container.get('logger');
  let adminAccess = function (req, res, next) {
    container.get('admin-access').process(req, res, next);
  };

  app.use(logger.routerLogger);
  app.use(bodyParser.json({strict: false, limit: '10mb'}));
  app.use(requestParser);
  app.use(paramParser);

  app.get('/-/ping', function (req, res) {
    res.send({
      message: 'ap-npm is running'
    });
  });

  app.get('/admin', adminAccess, function (req, res) {
    let route = container.get('route-admin');
    route.process(req, res);
  });

  app.get('/admin/all', adminAccess, function (req, res) {
    let route = container.get('route-admin-all');
    route.process(req, res);
  });

  app.get('/admin/config', adminAccess, function (req, res) {
    let route = container.get('route-admin-config');
    route.process(req, res);
  });

  // *** AUTH ***
  app.post('/-/v1/login', function (req, res) {
    let route = container.get('route-auth-user-login');
    route.process(req, res);
  });
  app.put('/-/user/org.couchdb.user:_rev?/:revision?', function (req, res) {
    let route = container.get('route-auth-user-login');
    route.process(req, res);
  });
  // Logout
  app.delete('/-/user/token/*', function (req, res) {
    let route = container.get('route-auth-user-logout');
    route.process(req, res);
  });
  // for "npm whoami"
  app.get('/whoami', function (req, res) {
    let route = container.get('route-auth-whoami');
    route.process(req, res);
  });
  // for "npm whoami"
  app.get('/-/whoami', function (req, res) {
    let route = container.get('route-auth-whoami');
    route.process(req, res);
  });


  // *** INSTALL ***
  // Get version of package
  app.get('/:package/:version?', access.can('access'), function (req, res) {
    let route;
    if (req.params.write) {
      route = container.get('route-package-unpublish');
    } else {
      route = container.get('route-package-get-json');
    }
    route.process(req, res);
  });
  // Request for package file data
  app.get('/:package/-/:filename', access.can('access'), function (req, res) {
    let route = container.get('route-package-get');
    route.process(req, res);
  });

  // *** DIST-TAGS ***
  app.get('/-/package/:package/dist-tags', access.can('access'), function (req, res) {
    let route = container.get('route-package-get-dist-tags');
    route.process(req, res);
  });
  app.delete('/-/package/:package/dist-tags/:tag', access.can('publish'), function (req, res) {
    let route = container.get('route-package-delete-dist-tags');
    route.process(req, res);
  });
  app.put('/-/package/:package/dist-tags/:tag', access.can('publish'), function (req, res) {
    let route = container.get('route-package-add-dist-tags');
    route.process(req, res);
  });


  // *** PUBLISH ***
  app.put('/:package/:_rev?/:revision?', access.can('publish'), function (req, res) {
    let route = container.get('route-package-publish');
    route.process(req, res);
  });

  app.delete('/:package/:_rev?/:revision?', access.can('publish'), function (req, res) {
    let route = container.get('route-package-delete');
    route.process(req, res);
  });

  // To test if ap-npm is running
  app.get('/', function (req, res) {
    if (req.url === '/' || req.url === '') {
      res.send("ap-npm is running\n");
    }
  });


  return app;
}

