import Service from './Service'
import { http as HTTP } from '../../../../http/index'
import { logRequest, processUrl } from './helper'

import { get } from 'lodash'

export default class Api extends Service {
  /**
   * @param {Object} options
   */
  constructor (options) {
    super(options)
    this.setDomain(get(this.options, 'domain', ''))
  }

  /**
   * Set API request domain
   *
   * @param domain
   */
  setDomain (domain) {
    this.domain = domain
  }

  /**
   * Função que faz uma requisição GET na API
   *
   * @param {Object} options
   * @returns Promise
   */
  async get (options) {
    await logRequest(processUrl(this.domain, options), 'GET')
    return HTTP.get(processUrl(this.domain, options)).then(response => response.data)
  }

  /**
   * Função que faz uma requisição POST na API
   *
   * @param {Object} options
   * @returns Promise
   */
  async post (options) {
    const { data } = options
    await logRequest(processUrl(this.domain, options), 'POST', data)
    return HTTP.post(processUrl(this.domain, options), data).then(response => response.data)
  }

  /**
   * Função que faz uma requisição PUT na API
   *
   * @param {Object} options
   * @returns Promise
   */
  async put (options) {
    const { data } = options
    await logRequest(processUrl(this.domain, options), 'PUT', data)
    return HTTP.put(processUrl(this.domain, options), data).then(response => response.data)
  }

  /**
   * Função que faz uma requisição POST/PUT na API
   * Caso existe o id no objeto data, a requisição sera PUT, caso não, será POST
   *
   * @param {Object} options
   * @returns Promise
   */
  async save (options) {
    const { data } = options
    const id = get(data, 'id', null)
    if (id && id > 0) {
      options.id = id
      return this.put(options)
    }
    return this.post(options)
  }

  /**
   * Função que faz uma requisição DELETE na API
   *
   * @param {Object} options
   * @returns Promise
   */
  async destroy (options) {
    await logRequest(processUrl(this.domain, options), 'DELETE')
    return HTTP.delete(processUrl(this.domain, options)).then(response => response.data)
  }

  /**
   * Busca todos os registros do domain
   *
   * @param {Object} options
   * @returns Promise
   */
  async all (options) {
    await logRequest(processUrl(this.domain, options), 'GET')
    return HTTP.get(processUrl(this.domain, options)).then(response => response.data)
  }

  /**
   * Busca dinâmica de registros do domain
   *
   * @param {Object} options
   * @returns Promise
   */
  async search (options) {
    options.searchRoute = true
    const { data } = options
    await logRequest(processUrl(this.domain, options), 'POST', data)
    return HTTP.post(processUrl(this.domain, options), data).then(response => response.data)
  }
}
