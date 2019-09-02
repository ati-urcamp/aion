import baseConfig from '../config'

export default {
  // Base API path
  config: {
    appName: baseConfig.appName,
    apiPath: baseConfig.basePath
  },
  // Auth
  user: {
    id: null,
    name: ''
  },
  token: '',
  permissions: [],
  teamPermissions: [],
  // Loader
  isLoading: true,
  loadingMessage: 'Carregando dados',
  // Sidebar
  showSidebar: true,
  // Notification
  notification: {
    title: '',
    message: ''
  },
  // Page title
  pageTitle: '',
  // Main list component
  listStore: {
    options: {},
    listData: [],
    listSort: []
  }
}
