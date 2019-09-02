import Board from './components/Board'

export default [
  {
    path: '/tarefa/board',
    component: Board,
    name: 'tarefa-board.index',
    meta: {
      name: 'Board',
      singularName: 'Board',
      breadcrumb: [
        { name: 'Tarefas', to: 'tarefa.index' }
      ]
    }
  }
]
