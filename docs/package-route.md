# Handling of routes

When npm install is run and sends a requests to ap-npm the following happens:

- Route gets rerouted in routes.js to `routes/package-request`, This route processes the request and sends the package.json data stored in our storage to npm.
- npm reads the package.json data, searching for the requested version and sends a second request to ap-npm which has the following pattern: `/:package/-/packageFileName`
    
- This request is rerouted by ap-npm to `routes/package-get`, this route reads the data from the filesystem and returns it in a response to npm. 