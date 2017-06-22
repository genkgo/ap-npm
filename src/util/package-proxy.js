import https from 'https';

export default class {

    constructor() {}

    process(httpRequest, httpResponse) {
        return new Promise((resolve, reject) => {
            https.get('https://registry.npmjs.org/' +
                httpRequest.params.package,
                function(response) {
                    response.pipe(httpResponse);
                }
            );
        }).catch(err => {
            httpResponse.status(500);
            httpResponse.send(err);
        });
    }
}