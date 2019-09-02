import Api from '../common/api/Api'

export default class ProjetoService extends Api {
  constructor () {
    super({ domain: 'projeto' })
  }

  async atualizarSituacao (projeto, situacao) {
    const options = {
      route: `${projeto}/atualizar-situacao`,
      data: {
        ref_projeto_situacao: situacao
      }
    }

    return this.post(options)
  }

  async reordenar (projetos) {
    const options = {
      route: `reordenar`,
      data: {
        projetos: projetos
      }
    }

    return this.post(options)
  }
}
