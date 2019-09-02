import Api from '../common/api/Api'

export default class Auth extends Api {
  constructor () {
    super({ domain: '' })
  }

  async login (data) {
    return this.post({ route: 'login', data })
  }

  async logout () {
    return this.get({ route: 'logout' })
  }
}
