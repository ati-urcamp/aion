let basePath = process.env.VUE_APP_API_URL
let baseAPIGroup = 'api'
let APIVersion = 'v1'

// Export default configs
export default {
  appName: 'Aion - Gestão de tarefas',
  basePath: basePath,
  baseAPIGroup: baseAPIGroup,
  APIVersion: APIVersion,
  fullAPIPath: [basePath, baseAPIGroup, APIVersion, ''].join('/')
}
