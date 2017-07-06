export default function (container) {
  container.set('route-package-get-json', function () {
    let Route = require('../routes/package-get-json').default;
    return new Route(container.get('storage'), container.get('proxy'), container.get('config').proxyEnabled);
  });

  container.set('route-package-publish', function () {
    let Route = require('../routes/package-publish').default;
    return new Route(container.get('storage'), container.get('validator'));
  });

  container.set('route-package-get', function () {
    let Route = require('../routes/package-get').default;
    return new Route(container.get('storage'), container.get('validator'));
  });

  container.set('route-package-delete', function () {
    let Route = require('../routes/package-delete').default;
    return new Route(container.get('storage'), container.get('validator'), container.get('config'));
  });

  container.set('route-package-get-dist-tags', function () {
    let Route = require('../routes/package-get-dist-tags').default;
    return new Route(container.get('storage'), container.get('validator'));
  });

  container.set('route-package-delete-dist-tags', function () {
    let Route = require('../routes/package-delete-dist-tags').default;
    return new Route(container.get('storage'), container.get('validator'));
  });

  container.set('route-package-add-dist-tags', function () {
    let Route = require('../routes/package-add-dist-tags').default;
    return new Route(container.get('storage'), container.get('validator'));
  });

}