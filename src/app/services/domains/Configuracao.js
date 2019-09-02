import Api from '../common/api/Api'

export default class ConfiguracaoService extends Api {
  constructor () {
    super({ domain: 'configuracao' })
  }
}
