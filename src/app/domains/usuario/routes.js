import List from './components/List'
import Form from './components/Form'

export default [
  {
    path: '/usuario',
    component: List,
    name: 'usuario.index',
    meta: {
      name: 'Usuários',
      singularName: 'Usuário'
    }
  },
  {
    path: '/usuario/create',
    component: Form,
    name: 'usuario.create',
    meta: {
      name: 'Criar usuário',
      breadcrumb: [
        { name: 'Usuários', to: 'usuario.index' }
      ]
    }
  },
  {
    path: '/usuario/:id',
    component: Form,
    name: 'usuario.edit',
    meta: {
      name: 'Editando usuário',
      breadcrumb: [
        { name: 'Usuários', to: 'usuario.index' }
      ]
    }
  }
]
