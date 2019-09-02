import Api from '../common/api/Api'

export default class PermissaoService extends Api {
  constructor () {
    super({ domain: 'permissao' })
  }
}
