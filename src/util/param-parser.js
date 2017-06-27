export default function (req, res, next) {
  let url = decodeURIComponent(req.url);
  let params = url.split('?');
  for (let i = 1; i < params.length; i++) {
    let param = params[i].split('=');
    req.params[param[0]] = param[1];
  }
  next();
}