export default class {

  constructor() {
    this.gotCalled = false;
  }

  process(req, res) {
    return new Promise(resolve => resolve(this.gotCalled = true));
  }

}