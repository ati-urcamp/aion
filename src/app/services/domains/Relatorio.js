import Api from '../common/api/Api'

export default class RelatorioService extends Api {
  constructor () {
    super({ domain: 'relatorio' })
  }

  async gerarRelatorioTarefasPeriodo (dtInicial, dtFinal) {
    return this.get({ route: `tarefas-por-periodo?dt_inicial=${dtInicial}&dt_final=${dtFinal}` })
  }
}
