import List from './components/List'
import Form from './components/Form'

export default [
  {
    path: '/projeto/situacao',
    component: List,
    name: 'projeto-situacao.index',
    meta: {
      name: 'Situações',
      singularName: 'Situação',
      breadcrumb: [
        { name: 'Projetos', to: 'projeto.index' }
      ]
    }
  },
  {
    path: '/projeto/situacao/create',
    component: Form,
    name: 'projeto-situacao.create',
    meta: {
      name: 'Criar situação',
      breadcrumb: [
        { name: 'Projetos', to: 'projeto.index' }
      ]
    }
  },
  {
    path: '/projeto/situacao/:id',
    component: Form,
    name: 'projeto-situacao.edit',
    meta: {
      name: 'Editando situação',
      breadcrumb: [
        { name: 'Projetos', to: 'projeto.index' }
      ]
    }
  }
]
