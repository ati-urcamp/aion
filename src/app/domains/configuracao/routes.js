import List from './components/List'
import Form from './components/Form'

export default [
  {
    path: '/configuracao',
    component: List,
    name: 'configuracao.index',
    meta: {
      name: 'Configurações',
      singularName: 'Configuração'
    }
  },
  {
    path: '/configuracao/create',
    component: Form,
    name: 'configuracao.create',
    meta: {
      name: 'Criar configuração',
      breadcrumb: [
        { name: 'Configurações', to: 'configuracao.index' }
      ]
    }
  },
  {
    path: '/configuracao/:id',
    component: Form,
    name: 'configuracao.edit',
    meta: {
      name: 'Editando configuração',
      breadcrumb: [
        { name: 'Configurações', to: 'configuracao.index' }
      ]
    }
  }
]
