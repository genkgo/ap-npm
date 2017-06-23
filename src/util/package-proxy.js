import https from 'https';

export default class {

    constructor(proxyUrl) {
        this.proxyUrl = proxyUrl;
    }

    process(httpRequest, httpResponse) {
        return new Promise((resolve, reject) => {
            https.get(this.proxyUrl + '/' +
                httpRequest.params.package,
                function (response) {
                    response.pipe(httpResponse);
                }
            );
        }).catch(err => {
            httpResponse.status(500);
            httpResponse.send(err);
        });
    }
}