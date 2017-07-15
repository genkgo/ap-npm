export default class {

  constructor() {
    this.services = {};
    this.resolved = {};
  }

  /**
   * @param {String} name name of the service
   * @param {*} service service to return on get
   * @return {Void} -
   */
  set(name, service) {
    this.services[name] = service;
  }

  /**
   * @param {String} name name of service
   * @return {*} requested service
   * @throws {Error} Cannot find service [service]
   */
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