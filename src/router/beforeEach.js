import store from '../vuex'

import bus from '../utils/bus'
import { get } from '../utils/storage'

const needAuth = route => route.meta.auth !== false

export default async (to, from, next) => {
  // Position the scroll on top
  window.scrollTo(0, 0)

  // Show global loader
  bus.$emit('show-loader')

  // Await 300 ms to continue with router
  setTimeout(async () => {
    // Check if route doesn't need auth
    if (!needAuth(to)) {
      return next()
    }

    // Get auth data from storage
    const teamPermissions = await get('teamPermissions')
    const permissions = await get('permissions')
    const token = await get('token')
    const user = await get('user')

    // If token doesn't exists, redirect to auth page
    if (!token) {
      return next({ name: 'login' })
    }

    // If exists, store in vuex the auth data
    const login = { teamPermissions, permissions, token, user }

    // Store login info in vuex to keep user logged
    await store.dispatch('login', login)
    return next()
  }, 300)
}
