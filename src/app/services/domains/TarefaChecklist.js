import Api from '../common/api/Api'

export default class TarefaChecklistService extends Api {
  constructor () {
    super({ domain: 'tarefa-checklist' })
  }

  async gravarChecklist (checklist, data) {
    return this.post({ data })
  }

  async removerChecklist (checklist) {
    return this.destroy({ id: checklist.id })
  }

  async alterarStatusChecklist (checklist, data) {
    return this.put({ id: checklist.id, data })
  }
}
