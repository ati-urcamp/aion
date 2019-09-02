import messages from './messages'

/**
 * Intercept axios responses
 */
export default (http, router, store) => {
  http.interceptors.response.use(
    response => messages.success(response),
    error => messages.error(error, router, store)
  )
}
