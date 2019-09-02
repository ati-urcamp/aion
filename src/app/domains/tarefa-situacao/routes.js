import List from './components/List'
import Form from './components/Form'

export default [
  {
    path: '/tarefa/situacao',
    component: List,
    name: 'tarefa-situacao.index',
    meta: {
      name: 'Situações',
      singularName: 'Situação',
      breadcrumb: [
        { name: 'Tarefas', to: 'tarefa.index' }
      ]
    }
  },
  {
    path: '/tarefa/situacao/create',
    component: Form,
    name: 'tarefa-situacao.create',
    meta: {
      name: 'Criar situação',
      breadcrumb: [
        { name: 'Tarefas', to: 'tarefa.index' }
      ]
    }
  },
  {
    path: '/tarefa/situacao/:id',
    component: Form,
    name: 'tarefa-situacao.edit',
    meta: {
      name: 'Editando situação',
      breadcrumb: [
        { name: 'Tarefas', to: 'tarefa.index' }
      ]
    }
  }
]
