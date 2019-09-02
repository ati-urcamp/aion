import List from './components/List'
import Form from './components/Form'

export default [
  {
    path: '/projeto',
    component: List,
    name: 'projeto.index',
    meta: {
      name: 'Projetos',
      singularName: 'Projeto'
    }
  },
  {
    path: '/projeto/create',
    component: Form,
    name: 'projeto.create',
    meta: {
      name: 'Criar projeto',
      breadcrumb: [
        { name: 'Projetos', to: 'projeto.index' }
      ]
    }
  },
  {
    path: '/projeto/:id',
    component: Form,
    name: 'projeto.edit',
    meta: {
      name: 'Editando projeto',
      breadcrumb: [
        { name: 'Projetos', to: 'projeto.index' }
      ]
    }
  }
]
