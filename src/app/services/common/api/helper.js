import baseConfig from '../../../../config'
import { get } from 'lodash'

const devEnvironment = process.env.NODE_ENV === 'development'

/**
 *
 * @param url
 * @param method
 * @param data
 * @returns {Promise<void>}
 */
export const logRequest = async (url, method, data) => {
  if (devEnvironment) {
    data = data || {}
    const token = await get('token')
    const request = {
      path: baseConfig.fullAPIPath + url,
      auth: token ? 'Bearer ' + token : '',
      method: method,
      params: JSON.stringify(data)
    }
    console.log(`%c${request.method} ${url} `, `background:#384A5E; padding: 3px; border-radius: 3px;  color: #fff`, request)
  }
}

/**
 * Função que processa a url para utilizar o padrão da API
 *
 * @param {String} domain
 * @param {Object} options
 * @returns string
 */
export const processUrl = (domain, options) => {
  let hasUrlParams = false
  let url = get(options, 'domain', domain)
  const route = get(options, 'route', null)
  const id = get(options, 'id', null)
  const columns = get(options, 'columns', null)
  const relations = get(options, 'relations', null)
  const page = get(options, 'page', 1)
  const perPage = get(options, 'perPage', 50)
  const searchRoute = get(options, 'searchRoute', false)

  // Checa se a rota é de pesquisa
  if (searchRoute) {
    url = url + '/search'
  }

  if (id && id > 0) {
    url += '/' + id
  }
  url += (route ? '/' + route : '')
  url += '?q='

  // Inclui os dados da paginação na URL caso os parâmetros sejam passados
  if (searchRoute && page) {
    url += '&_page=' + page
    hasUrlParams = true
  }

  // Inclui os dados da paginação na URL caso os parâmetros sejam passados
  if (searchRoute && perPage) {
    url += '&_limit=' + perPage
    hasUrlParams = true
  }

  // Inclui as colunas que devem retornar na requisição
  if (!!columns && columns.length > 0) {
    columns.forEach(function (val) {
      if (val.length > 0) {
        url += '&_columns[]=' + val
      }
    })
    hasUrlParams = true
  }

  // Inclui os relacionamentos que devem retornar na requisição
  if (!!relations && relations.length > 0) {
    relations.forEach(function (val) {
      if (val.length > 0) {
        url += '&_with[]=' + val
      }
    })
    hasUrlParams = true
  }
  if (!hasUrlParams) {
    url = url.replace('?q=', '')
  }
  return url
}
