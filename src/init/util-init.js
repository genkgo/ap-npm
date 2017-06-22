import path from 'path';

export default function(container) {
    container.set('remote-registry', function() {
        let Route = require('../routes/auth-user-add').default;
        return new Route();
    });

    container.set('express', function() {
        let express = require('express');
        let routes = require('../routes').default;
        let app = express();
        app.set('env', process.env.NODE_ENV || 'production');
        routes(app, container);
        return app;
    });

    container.set('package-validator', function() {
        let PackageValidator = require('../package/validator').default;
        return new PackageValidator(container.get('storage'));
    });

    container.set('auth', function() {
        let Auth = require('../auth/index').default;
        return new Auth(container.get('auth-adapter'), container.get('config'));
    });

    container.set('auth-adapter', function() {
        let AuthAdapter;
        if (container.get('config').auth.adapter === '/auth/json-db') {
            AuthAdapter = require(path.join(__dirname, '..', container.get('config').auth.adapter)).default;
        } else {
            AuthAdapter = require(container.get('config').auth.adapter).default;
        }
        return new AuthAdapter(container.get('config'));
    });

    container.set('proxy', function() {
        let Util = require('../util/package-proxy').default;
        return new Util();
    })
}