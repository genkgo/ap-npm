export default function (req, res, next) {
  console.log("METHOD:", req.method, ", URL:", decodeURIComponent(req.originalUrl), '\n');
  next();
}