export default function(container) {
    container.set('route-package-request', function() {
        let Route = require('../routes/package-request').default;
        return new Route(container.get('storage'), container.get('proxy'), true);
    });

    container.set('route-package-publish', function() {
        let Route = require('../routes/package-publish').default;
        return new Route(container.get('storage'), container.get('package-validator'));
    });

    container.set('route-package-get', function() {
        let Route = require('../routes/package-get').default;
        return new Route(container.get('storage'), container.get('package-validator'));
    });

    container.set('route-package-delete', function() {
        let Route = require('../routes/package-delete').default;
        return new Route(container.get('storage'), container.get('package-validator'), container.get('config'));
    });

    container.set('route-package-get-dist-tags', function() {
        let Route = require('../routes/package-get-dist-tags').default;
        return new Route(container.get('storage'), container.get('package-validator'));
    });

    container.set('route-package-delete-dist-tags', function() {
        let Route = require('../routes/package-delete-dist-tags').default;
        return new Route(container.get('storage'), container.get('package-validator'));
    });

    container.set('route-package-add-dist-tags', function() {
        let Route = require('../routes/package-add-dist-tags').default;
        return new Route(container.get('storage'), container.get('package-validator'));
    });
}