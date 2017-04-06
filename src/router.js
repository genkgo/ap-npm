import Express from 'express';

let app = new Express();

app.get('/-/package/:package/dist-tags', function () {
  container.get('route-dist-tags').handle(request, response);
});