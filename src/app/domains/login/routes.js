import Login from './components/Login'

export default [
  {
    path: '/login',
    component: Login,
    name: 'login',
    meta: {
      name: 'Login',
      auth: false
    }
  }
]
