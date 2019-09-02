import { merge } from 'lodash'
import bus from '../../../utils/bus'
import swal from 'sweetalert2'
import store from '../../../vuex'

/**
 * Função que trata as options informadas
 * @param options
 * @returns Object
 */
function _handleData (options) {
  const defaultOptions = {
    title: 'Sucesso!',
    message: 'Os dados foram gravados'
  }
  options = merge(defaultOptions, options)
  if (options.hasOwnProperty('hideLoader') && options.hideLoader) {
    bus.$emit('hide-loader')
  }
  return options
}

function _showNotification (options) {
  // options.html = options.message
  delete options.hideLoader
  store.dispatch('showNotification', options)
  // swal(options)
}

/**
 * Mostra notificação de sucesso
 * @param options
 */
function _success (options) {
  options = _handleData(options)
  options.type = 'success'
  _showNotification(options)
}

/**
 * Mostra notificação de aviso
 * @param options
 */
function _warning (options) {
  options = _handleData(options)
  options.type = 'warning'
  _showNotification(options)
}

export const success = _success
export const warning = _warning
