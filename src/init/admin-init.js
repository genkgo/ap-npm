export default function (container) {
  container.set('route-admin', function () {
    let Route = require('../routes/admin').default;
    return new Route();
  });

  container.set('route-admin-all', function () {
    let Route = require('../routes/admin-all').default;
    return new Route(container.get('storage'));
  });

  container.set('route-admin-config', function () {
    let Route = require('../routes/admin-config').default;
    return new Route(container.get('config'));
  });

  container.set('admin-access', function () {
    let AdminAccess = require('../admin/admin-access').default;
    return new AdminAccess(container.get('auth'));
  })
}