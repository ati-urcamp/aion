import Vue from 'vue'
import helpers from '../mixins/helper'

/**
 * Filtro VueJS para exibir datas no format pt-br
 */
Vue.filter('dateEnToBr', function (value) {
  if (!value) return ''
  return helpers.methods.dateFormat(value, 'br')
})

/**
 * Filtro VueJS para exibir data/hora no format pt-br
 */
Vue.filter('dateTimeEnToBr', function (value) {
  if (!value) return ''
  return helpers.methods.dateTimeFormat(value, 'br', true)
})

/**
 * Filtro VueJS para exibir somente a hora no format pt-br
 */
Vue.filter('timeEnToBr', function (value) {
  if (!value) return ''
  return helpers.methods.dateTimeToTimeFormat(value, 'br')
})

/**
 * Filtro VueJS para exibir valor monetário no format pt-br
 */
Vue.filter('currencyEnToBr', function (value) {
  if (value === 0) return '0,00'
  if (!value) return ''
  return helpers.methods.currencyEnToBr(value)
})

Vue.filter('ucwords', function (value) {
  return helpers.methods.ucwords(value)
})

Vue.filter('time', function (value) {
  if (!value) return ''
  value = value.toString().split(':')
  return value[0] + ':' + value[1]
})

Vue.filter('firstAndLastName', function (value) {
  const valueExploded = value.split(' ')
  return valueExploded[0] + ' ' + valueExploded[valueExploded.length - 1]
})
