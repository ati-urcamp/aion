import List from './components/List'
import Form from './components/Form'

export default [
  {
    path: '/tarefa/tipo',
    component: List,
    name: 'tarefa-tipo.index',
    meta: {
      name: 'Tipos',
      singularName: 'Tipo',
      breadcrumb: [
        { name: 'Tarefas', to: 'tarefa.index' }
      ]
    }
  },
  {
    path: '/tarefa/tipo/create',
    component: Form,
    name: 'tarefa-tipo.create',
    meta: {
      name: 'Criar tipo',
      breadcrumb: [
        { name: 'Tarefas', to: 'tarefa.index' }
      ]
    }
  },
  {
    path: '/tarefa/tipo/:id',
    component: Form,
    name: 'tarefa-tipo.edit',
    meta: {
      name: 'Editando tipo',
      breadcrumb: [
        { name: 'Tarefas', to: 'tarefa.index' }
      ]
    }
  }
]
