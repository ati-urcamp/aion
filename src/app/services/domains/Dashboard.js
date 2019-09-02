import Api from '../common/api/Api'

export default class DashboardService extends Api {
  constructor () {
    super({ domain: 'dashboard' })
  }

  async totaisPorSituacao () {
    return this.get({ route: `totais-por-situacao` })
  }

  async totaisPorTipo () {
    return this.get({ route: `totais-por-tipo` })
  }

  async totaisPorTimesheet () {
    return this.post({ route: `totais-por-timesheet` })
  }
}
