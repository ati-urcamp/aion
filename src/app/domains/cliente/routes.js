import List from './components/List'
import Form from './components/Form'

export default [
  {
    path: '/cliente',
    component: List,
    name: 'cliente.index',
    meta: {
      name: 'Clientes',
      singularName: 'Cliente'
    }
  },
  {
    path: '/cliente/create',
    component: Form,
    name: 'cliente.create',
    meta: {
      name: 'Criar cliente',
      breadcrumb: [
        { name: 'Clientes', to: 'cliente.index' }
      ]
    }
  },
  {
    path: '/cliente/:id',
    component: Form,
    name: 'cliente.edit',
    meta: {
      name: 'Editando cliente',
      breadcrumb: [
        { name: 'Clientes', to: 'cliente.index' }
      ]
    }
  }
]
