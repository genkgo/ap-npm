export default function(container) {
  container.set('route-auth-user-login', function() {
    let Route = require('../routes/auth-user-login').default;
    return new Route(container.get('auth'));
  });

  container.set('route-auth-whoami', function() {
    let Route = require('../routes/auth-whoami').default;
    return new Route(container.get('auth'));
  });

  container.set('route-auth-user-logout', function () {
    let Route = require('../routes/auth-user-logout').default;
    return new Route(container.get('auth'));
  });
}