import Api from '../common/api/Api'

export default class ClienteService extends Api {
  constructor () {
    super({ domain: 'cliente' })
  }
}
