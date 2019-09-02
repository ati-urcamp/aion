import * as TYPES from './types'
import { clear, set } from '../utils/storage'

export default {
  showLoader: (context) => {
    context.commit(TYPES.LOADER_SHOW, true)
  },
  hideLoader: (context) => {
    setTimeout(() => {
      context.commit(TYPES.LOADER_SHOW, false)
    }, 300)
  },
  toggleSidebar: (context, payload) => {
    context.commit(TYPES.TOGGLE_SIDEBAR, payload)
  },
  showNotification: (context, payload) => {
    context.commit(TYPES.NOTIFICATION, payload)
  },
  setPageTitle: (context, payload) => {
    context.commit(TYPES.PAGE_TITLE, payload)
  },
  setListOptions: (context, payload) => {
    context.commit(TYPES.LIST_OPTIONS, payload)
  },
  setListData: (context, payload) => {
    context.commit(TYPES.LIST_DATA, payload)
  },
  setListSort (context, payload) {
    context.commit(TYPES.LIST_SORT, payload)
  },
  login: (context, payload) => {
    return new Promise((resolve) => {
      set('user', payload.user)
      set('token', payload.token)
      set('permissions', payload.permissions)
      set('teamPermissions', payload.teamPermissions)
      context.commit(TYPES.AUTH_USER, payload.user)
      context.commit(TYPES.AUTH_TOKEN, payload.token)
      context.commit(TYPES.AUTH_PERMISSIONS, payload.permissions)
      context.commit(TYPES.AUTH_TEAM_PERMISSIONS, payload.teamPermissions)
      resolve()
    })
  },
  logout: (context) => {
    return new Promise((resolve) => {
      clear()
      context.commit(TYPES.AUTH_USER, {})
      context.commit(TYPES.AUTH_TOKEN, '')
      context.commit(TYPES.AUTH_PERMISSIONS, [])
      context.commit(TYPES.AUTH_TEAM_PERMISSIONS, [])
      resolve()
    })
  }
}
