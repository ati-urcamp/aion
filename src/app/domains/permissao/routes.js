import List from './components/List'
import Form from './components/Form'

export default [
  {
    path: '/permissao',
    component: List,
    name: 'permissao.index',
    meta: {
      name: 'Permissões',
      singularName: 'Permissão'
    }
  },
  {
    path: '/permissao/create',
    component: Form,
    name: 'permissao.create',
    meta: {
      name: 'Criar permissão',
      breadcrumb: [
        { name: 'Permissões', to: 'permissao.index' }
      ]
    }
  },
  {
    path: '/permissao/:id',
    component: Form,
    name: 'permissao.edit',
    meta: {
      name: 'Editando permissão',
      breadcrumb: [
        { name: 'Permissões', to: 'permissao.index' }
      ]
    }
  }
]
