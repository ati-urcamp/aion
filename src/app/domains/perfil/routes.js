import List from './components/List'
import Form from './components/Form'

export default [
  {
    path: '/perfil',
    component: List,
    name: 'perfil.index',
    meta: {
      name: 'Perfis',
      singularName: 'Perfil'
    }
  },
  {
    path: '/perfil/create',
    component: Form,
    name: 'perfil.create',
    meta: {
      name: 'Criar perfil',
      breadcrumb: [
        { name: 'Perfis', to: 'perfil.index' }
      ]
    }
  },
  {
    path: '/perfil/:id',
    component: Form,
    name: 'perfil.edit',
    meta: {
      name: 'Editando perfil',
      breadcrumb: [
        { name: 'Perfis', to: 'perfil.index' }
      ]
    }
  }
]
