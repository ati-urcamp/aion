import Api from '../common/api/Api'

export default class PessoaService extends Api {
  constructor () {
    super({ domain: 'pessoa' })
  }
}
