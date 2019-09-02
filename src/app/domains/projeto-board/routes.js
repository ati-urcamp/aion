import Board from './components/Board'

export default [
  {
    path: '/projeto/board',
    component: Board,
    name: 'projeto-board.index',
    meta: {
      name: 'Board',
      singularName: 'Board',
      breadcrumb: [
        { name: 'Projetos', to: 'projeto.index' }
      ]
    }
  }
]
