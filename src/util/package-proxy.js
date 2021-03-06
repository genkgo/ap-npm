import https from 'https';

export default class {

  constructor(proxyUrl) {
    this.proxyUrl = proxyUrl;
  }

  process(httpRequest, httpResponse) {
    return new Promise(() => {
      let pkgData = httpRequest.body;
      let urlPath;

      if (pkgData._scopedName) {
        urlPath = pkgData._scopedName;
      } else {
        urlPath = '/' + pkgData._packageName;
      }

      let url = this.proxyUrl + urlPath;
      https.get(url,
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