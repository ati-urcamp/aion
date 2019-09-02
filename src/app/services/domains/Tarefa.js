import Api from '../common/api/Api'

export default class TarefaService extends Api {
  constructor () {
    super({ domain: 'tarefa' })
  }

  async iniciar (tarefa) {
    return this.get({ route: `${tarefa}/iniciar` })
  }

  async pausar (tarefa, data) {
    return this.post({ route: `${tarefa}/pausar`, data: data })
  }

  async finalizar (tarefa) {
    return this.get({ route: `${tarefa}/finalizar` })
  }

  async reabrir (tarefa) {
    return this.get({ route: `${tarefa}/reabrir` })
  }

  async duplicar (tarefa) {
    return this.get({ route: `${tarefa}/duplicar` })
  }

  async arquivar (tarefa) {
    return this.get({ route: `${tarefa}/arquivar` })
  }

  async atualizarSituacao (tarefa, situacao) {
    const options = {
      route: `${tarefa}/atualizar-situacao`,
      data: {
        ref_tarefa_situacao: situacao
      }
    }

    return this.post(options)
  }

  async reordenar (tarefas) {
    const options = {
      route: `reordenar`,
      data: {
        tarefas: tarefas
      }
    }

    return this.post(options)
  }
}
