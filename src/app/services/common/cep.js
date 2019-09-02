import axios from 'axios'

/**
 * Cria uma instância do axios
 * @type {AxiosInstance}
 */
const httpCep = axios.create({
  baseURL: 'https://viacep.com.br/ws/',
  headers: { 'content-type': 'application/json' }
})

/**
 * Busca os dados de um CEP na API do viacep
 * @param cep
 * @returns {Promise<any>}
 */
function _get (cep) {
  return new Promise((resolve, reject) => {
    httpCep.get(cep + '/json').then(response => {
      if (response.data && response.data.hasOwnProperty('erro') && response.data.erro === true) {
        reject(response)
      } else {
        resolve(response.data)
      }
    })
  })
}

export const get = _get
