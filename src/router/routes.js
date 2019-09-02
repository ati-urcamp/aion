import { routes as app } from '../app'

// Rotas default da aplicação
const root = [
  {
    path: '/',
    name: 'home',
    redirect: { name: 'dashboard.index' }
  }
]

export default [...root, ...app]
