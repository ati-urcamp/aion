import List from './components/List'
import Form from './components/Form'

export default [
  {
    path: '/projeto/tipo',
    component: List,
    name: 'projeto-tipo.index',
    meta: {
      name: 'Tipos',
      singularName: 'Tipo',
      breadcrumb: [
        { name: 'Projetos', to: 'projeto.index' }
      ]
    }
  },
  {
    path: '/projeto/tipo/create',
    component: Form,
    name: 'projeto-tipo.create',
    meta: {
      name: 'Criar tipo',
      breadcrumb: [
        { name: 'Projetos', to: 'projeto.index' }
      ]
    }
  },
  {
    path: '/projeto/tipo/:id',
    component: Form,
    name: 'projeto-tipo.edit',
    meta: {
      name: 'Editando tipo',
      breadcrumb: [
        { name: 'Projetos', to: 'projeto.index' }
      ]
    }
  }
]
