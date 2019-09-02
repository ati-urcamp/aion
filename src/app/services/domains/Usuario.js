import Api from '../common/api/Api'

export default class UsuarioService extends Api {
  constructor () {
    super({ domain: 'usuario' })
  }
}
