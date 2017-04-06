export default class {

  fromHttpRequest(httpRequest) {

  }

  toHttpResponse(packageResponse, httpResponse) {
    let err = packageResponse.getError();
    let info = packageResponse.getInfo();

    if (err) return next(err)
    info = Utils.filter_tarball_urls(info, request, config)

    var version = request.params.version;
    if (!version) return next(info);

    var t = Utils.get_version(info, version);
    if (t !== null) return t;

    if (info['dist-tags'] !== null) {
      if (info['dist-tags'][version] !== null) {
        version = info['dist-tags'][version];
        t = Utils.get_version(info, version);
        if (t !== null) return t;
      }
    }
  }

}
