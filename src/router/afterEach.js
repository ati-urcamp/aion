import store from '../vuex'
import bus from '../utils/bus'

export default (to) => {
  if (typeof document !== 'undefined') {
    let breadcrumbItems = to.meta.breadcrumb ? to.meta.breadcrumb.map((item) => item.name).reverse() : []

    if (breadcrumbItems.length) {
      document.title = to.meta.name + ' - ' + breadcrumbItems.join(' - ') + ' | ' + store.state.config.appName
    } else {
      document.title = to.meta.name + ' | ' + store.state.config.appName
    }
  }

  if (to.meta.name) {
    store.dispatch('setPageTitle', to.meta.name || 'Aion')
  }

  setTimeout(() => {
    if (store.getters.isLoading) {
      bus.$emit('hide-loader')
    }
  }, 2000)
}
