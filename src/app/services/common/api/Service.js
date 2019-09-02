/**
 * @type {Service}
 */
export default class Service {
  /**
   * @param {*} options
   */
  constructor (options) {
    this.options = options
  }

  /**
   * @returns {Service}
   */
  static build () {
    return new this(this.options)
  }
}
