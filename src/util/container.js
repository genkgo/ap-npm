export default class {

  constructor() {
    this.services = {};
    this.resolved = {};
  }

  set(name, service) {
    this.services[name] = service;
  }

  get(name) {
    if (this.resolved[name]) {
      return this.resolved[name];
    }

    if (this.services[name]) {
      this.resolved[name] = this.services[name].call();
      return this.resolved[name];
    }

    throw new Error('Cannot find service ' + name);
  }

}