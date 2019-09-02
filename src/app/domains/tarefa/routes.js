import List from './components/List'
import Form from './components/Form'
import Show from './components/Show'

export default [
  {
    path: '/tarefa',
    component: List,
    name: 'tarefa.index',
    meta: {
      name: 'Tarefas',
      singularName: 'Tarefa'
    }
  },
  {
    path: '/tarefa/create',
    component: Form,
    name: 'tarefa.create',
    meta: {
      name: 'Criar tarefa',
      breadcrumb: [
        { name: 'Tarefas', to: 'tarefa.index' }
      ]
    }
  },
  {
    path: '/tarefa/:id/edit',
    component: Form,
    name: 'tarefa.edit',
    meta: {
      name: 'Editando tarefa',
      breadcrumb: [
        { name: 'Tarefas', to: 'tarefa.index' }
      ]
    }
  },
  {
    path: '/tarefa/:id',
    component: Show,
    name: 'tarefa.show',
    meta: {
      name: 'Visualizando tarefa',
      breadcrumb: [
        { name: 'Tarefas', to: 'tarefa.index' }
      ]
    }
  }
]
