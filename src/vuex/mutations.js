import { setToken } from '../http'
import * as TYPES from './types'

export default {
  [TYPES.AUTH_USER] (state, payload) {
    state.user = payload
  },
  [TYPES.AUTH_TOKEN] (state, payload) {
    setToken(payload)
    state.token = payload
  },
  [TYPES.AUTH_PERMISSIONS] (state, payload) {
    state.permissions = payload
  },
  [TYPES.AUTH_TEAM_PERMISSIONS] (state, payload) {
    state.teamPermissions = payload
  },
  [TYPES.LOADER_SHOW] (state, value) {
    state.isLoading = value
  },
  [TYPES.LOADER_MESSAGE] (state, payload) {
    state.loadingMessage = payload
  },
  [TYPES.TOGGLE_SIDEBAR] (state, payload) {
    state.showSidebar = payload
  },
  [TYPES.NOTIFICATION] (state, payload) {
    state.notification = payload
  },
  [TYPES.PAGE_TITLE] (state, payload) {
    state.pageTitle = payload
  },
  [TYPES.LIST_OPTIONS] (state, payload) {
    state.listStore.options = payload
  },
  [TYPES.LIST_DATA] (state, payload) {
    state.listStore.listData = payload
  },
  [TYPES.LIST_SORT] (state, payload) {
    state.listStore.listSort = payload
  }
}
