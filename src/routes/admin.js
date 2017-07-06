export default class {
  process(httpRequest, httpResponse) {
    httpResponse.send({
      message: "You are succesfully logged in"
    });
  }
}