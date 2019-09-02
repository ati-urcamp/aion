import List from './components/List'
import Form from './components/Form'

export default [
  {
    path: '/equipe',
    component: List,
    name: 'equipe.index',
    meta: {
      name: 'Equipes',
      singularName: 'Equipe'
    }
  },
  {
    path: '/equipe/create',
    component: Form,
    name: 'equipe.create',
    meta: {
      name: 'Criar equipe',
      breadcrumb: [
        { name: 'Equipes', to: 'equipe.index' }
      ]
    }
  },
  {
    path: '/equipe/:id',
    component: Form,
    name: 'equipe.edit',
    meta: {
      name: 'Editando equipe',
      breadcrumb: [
        { name: 'Equipes', to: 'equipe.index' }
      ]
    }
  }
]
