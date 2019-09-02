import AuthApiService from '../app/services/domains/Auth'

import { get } from 'lodash'
import swal from 'sweetalert2'

const devEnvironment = process.env.NODE_ENV === 'development'

/**
 * Handle API messages
 */
export default {
  success (response) {
    return response
  },

  error (error, router, store) {
    const swalData = {
      type: 'warning',
      title: 'Atenção',
      message: 'Falha ao realizar operação'
    }
    let logoutUser = false

    try {
      // API Timeout
      if (error.toString().includes('timeout')) {
        swalData.message = 'A sua solicitação está demorando muito, tente novamente mais tarde'
        if (devEnvironment) {
          console.error('[API TIMEOUT]')
        }
      } else {
        // Get status code
        const status = get(error, 'response.status')
        // Get error message
        const responseData = get(error, 'response.data') || 'Falha ao realizar operação'

        /**
         * Authorization errors
         */
        if ([401, 403].indexOf(status) > -1) {
          const responseMessage = get(responseData, 'message')
          const responseError = get(responseData, 'error')

          // Token expired force logout
          if (responseMessage && responseMessage === 'Token Signature could not be verified.') {
            logoutUser = true
            swalData.message = 'A assinatura do token não pode ser verificada'
          } else if (responseMessage && responseMessage === 'O token foi colocado na blacklist') {
            logoutUser = true
            swalData.message = responseMessage
          } else if (responseMessage && responseMessage === 'The token has been blacklisted') {
            logoutUser = true
            swalData.message = 'O token foi colocado na blacklist'
          } else if (responseMessage && responseMessage === 'Token has expired') {
            logoutUser = true
            swalData.message = 'Sua sessão expirou, faça login novamente'
          } else {
            let swalMessage = responseMessage

            if (!swalMessage) {
              swalMessage = responseError
            }

            swalData.message = swalMessage
          }
        }

        /**
         * Wrong/Missing data or Validation errors
         */
        if ([400, 422].indexOf(status) > -1) {
          const responseError = get(responseData, 'error')
          if (typeof responseError === 'string') {
            swalData.message = responseError
          }
          if (typeof responseError === 'object') {
            let errors = []
            for (error in responseError) {
              if (typeof responseError[error] === 'object' && responseError[error].length > 0) {
                errors.push(responseError[error][0])
              }
            }
            swalData.message = errors.join('<br>')
          }
        }

        /**
         * WebServer error
         */
        if ([500].indexOf(status) > -1) {
          swalData.message = 'Foi encontrado um erro ao processar a sua operação, por favor tente novamente mais tarde'
          swalData.type = 'error'
        }

        /**
         * WebServer in Maintenance
         */
        if ([503].indexOf(status) > -1) {
          swalData.message = 'O sistema está em processo de atualização, por favor tente novamente mais tarde'
          swalData.type = 'error'
        }
      }

      // Show alert modal
      swal.fire({ title: swalData.title, html: swalData.message, type: swalData.type })

      // Logout user
      if (logoutUser) {
        const authService = AuthApiService.build({})
        authService.logout().then(() => {
          store.dispatch('logout').then(() => {
            router.push({ name: 'login' })
          })
        })
      }
    } catch (e) {
      swal.fire({
        title: swalData.title,
        html: 'Aconteceu um erro de comunicação, tente novamente mais tarde',
        type: swalData.type
      })
      if (devEnvironment) {
        console.error('[API CONNECTION ERROR]')
      }
    }
    return Promise.reject(error)
  }
}
