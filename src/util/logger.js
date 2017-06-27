export default function (req, res, next) {
  console.log("\nMETHOD:", req.method, ", URL:", decodeURIComponent(req.originalUrl));
  next();
}