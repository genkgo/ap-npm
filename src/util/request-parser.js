export default function (req, res, next) {
  let url = decodeURIComponent(req.url);
  let splitUrl = url.split('/');
  let scope;
  let packageName;
  let requestedFile;

  if (splitUrl[2] === 'package') {
    next();
    return;
  }

  for (let i = 0; i < splitUrl.length; i++) {
    if (splitUrl[i].indexOf('@') !== -1) {
      if (scope) continue;
      scope = splitUrl[i];
      packageName = splitUrl[i + 1];
    }

    if (splitUrl[i].indexOf('-') !== -1) {
      if (i <= 1) continue;
      if (requestedFile) continue;
      if (scope) {
        requestedFile = splitUrl[i + 2];
      } else {
        requestedFile = splitUrl[i + 1];
      }
    }
  }

  if (scope && packageName) {
    req.body._scope = scope;
    req.body._packageName = packageName;
    req.body._scopedName = '/' + scope + '/' + packageName;
  } else {
    for (let i = 0; i < splitUrl.length; i++) {
      if (req.body._packageName) continue;
      if (splitUrl[i] !== '') {
        req.body._packageName = splitUrl[i];
        if (splitUrl[i + 1] === '-') {
          requestedFile = splitUrl[i + 2];
        }
      }
    }
  }

  if (requestedFile) {
    req.body._requestedFile = requestedFile;
  }

  if (packageName) {
    req.url = '/' + packageName;
    if (requestedFile) {
      req.url += '/-/' + requestedFile;
    }
  }

  next();
}