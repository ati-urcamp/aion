import moment from 'moment'
import * as MESSAGES from '../app/messages'

// Formatos de datas
const dateFormatBr = 'DD/MM/YYYY'
const dateFormatEn = 'YYYY-MM-DD'
const dateTimeFormatBr = 'DD/MM/YYYY HH:mm:SS'
const dateTimeFormatEn = 'YYYY-MM-DD HH:mm:SS'

/**
 * Função que verifica se o formato passado de data é válido
 * Caso sim, retorna uma instância do moment
 *
 * @param date
 * @returns moment
 */
const getMomentInstance = function (date) {
  let momentInstance = null
  if (moment(date, dateFormatBr, true).isValid()) {
    momentInstance = moment(date, dateFormatBr, true)
  } else if (moment(date, dateFormatEn, true).isValid()) {
    momentInstance = moment(date, dateFormatEn, true)
  } else if (moment(date, dateTimeFormatBr, true).isValid()) {
    momentInstance = moment(date, dateTimeFormatBr, true)
  } else if (moment(date, dateTimeFormatEn, true).isValid()) {
    momentInstance = moment(date, dateTimeFormatEn, true)
  } else {
    console.warn('Formato inválido', date)
  }
  return momentInstance
}

export default {
  methods: {
    /**
     * Retorna o datetime corrente do S.O.
     * @returns moment
     */
    momentNow: function () {
      return moment()
    },

    /**
     * Função para formatar datas
     *
     * @param date
     * @param format Formato de retorno (br ou en)
     * @returns string
     */
    dateFormat: function (date, format) {
      if (date === undefined || date === null || date.length < 1) {
        return ''
      }
      let momentInstance = getMomentInstance(date)
      if (!momentInstance) {
        return ''
      }
      format = format || 'br'
      return momentInstance.format(format === 'br' ? dateFormatBr : dateFormatEn)
    },

    /**
     * Função para formatar datetime
     *
     * @param datetime
     * @param format Formato de retorno (br ou en)
     * @param short Encurtar hora (Ex.: 15:30 ou 15:30:00)
     * @returns string
     */
    dateTimeToTimeFormat: function (datetime, short) {
      if (datetime === undefined || datetime === null || datetime.length < 1) {
        return ''
      }
      let momentInstance = getMomentInstance(datetime)
      if (!momentInstance) {
        return ''
      }
      short = short || false
      let resultFormat = (short ? 'HH:mm' : 'HH:mm:SS')
      return momentInstance.format(resultFormat)
    },

    /**
     * Função para formatar datetime
     *
     * @param datetime
     * @param format Formato de retorno (br ou en)
     * @param short Encurtar hora (Ex.: 15:30 ou 15:30:00)
     * @returns string
     */
    dateTimeFormat: function (datetime, format, short) {
      if (datetime === undefined || datetime === null || datetime.length < 1) {
        return ''
      }
      let momentInstance = getMomentInstance(datetime)
      if (!momentInstance) {
        return ''
      }
      format = format || 'br'
      short = short || false
      let resultFormat = (format === 'br' ? dateFormatBr : dateFormatEn) + ' ' + (short ? 'HH:mm' : 'HH:mm:SS')
      return momentInstance.format(resultFormat)
    },

    /**
     * Função para formatar time
     *
     * @param time
     * @param short Encurtar hora (Ex.: 15:30 ou 15:30:00)
     * @returns string
     */
    timeFormat: function (time, short) {
      if (time === undefined || time === null || time.length < 1) {
        return ''
      }
      let momentInstance = getMomentInstance(time)
      if (!momentInstance) {
        return ''
      }
      short = short || false
      return momentInstance.format(short ? 'HH:mm' : 'HH:mm:SS')
    },

    /**
     * Função para converter valor númerico string br (1.500,50) para float/decimal
     *
     * @param number
     * @returns float
     */
    currencyBrToEn: function (number) {
      if (number !== undefined && number !== false) {
        let newValue = number.replace('R$', '').replace('r$', '')
        if (newValue.indexOf(',') > -1) {
          let replaced = newValue.replace(/[.]/g, '')
          newValue = replaced.replace(',', '.')
        }
        return parseFloat(newValue)
      }
      return number
    },

    /**
     * Função para converter valor númerico float (1500.50) para string br (1.500,50)
     *
     * @param number
     * @returns string
     */
    currencyEnToBr: function (number) {
      if (number === 0) {
        return '0,00'
      }
      if (number !== undefined && number !== null) {
        return this.numberFormat(number, 2, ',', '.')
      }
      return number
    },

    /**
     * Função que simula o number_format do PHP
     *
     * @param number
     * @param decimals
     * @param decPoint
     * @param thousandsSep
     * @returns string
     */
    numberFormat: function (number, decimals, decPoint, thousandsSep) {
      number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
      let n = !isFinite(+number) ? 0 : +number
      let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
      let sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
      let dec = (typeof decPoint === 'undefined') ? '.' : decPoint
      let s = ''

      let toFixedFix = function (n, prec) {
        let k = Math.pow(10, prec)
        return '' + (Math.round(n * k) / k).toFixed(prec)
      }

      s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
      if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
      }
      if ((s[1] || '').length < prec) {
        s[1] = s[1] || ''
        s[1] += new Array(prec - s[1].length + 1).join('0')
      }

      return s.join(dec)
    },

    /**
     * Função para descartar qualquer caracter que não for número de uma string
     *
     * @param str
     * @returns string
     */
    onlyNumbers (str) {
      if (str === undefined || str === null) {
        return str
      }
      if (typeof str !== 'string') {
        str = str.toString()
      }
      return str.replace(/\D+/g, '')
    },

    /**
     * Função para arredondar valor decimal
     *
     * @param value
     * @param decimals
     * @returns {number}
     */
    roundLower: function (value, decimals) {
      let aux = Math.pow(10, decimals)
      return Math.floor(value * aux) / aux
    },

    /**
     * Função que converte bytes para string
     *
     * @param bytes
     * @returns {string}
     */
    bytesToSize: function (bytes) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      if (bytes === 0) return '0 Bytes'
      if (bytes === 1) return '1 Byte'
      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
      if (i === 0) return `${bytes} ${sizes[i]}`
      return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
    },

    /**
     * Check mobile info
     *
     * @returns {{Android: Android, BlackBerry: BlackBerry, iOS: iOS, Opera: Opera, Windows: Windows, any: any}}
     */
    isMobile: function () {
      let vm = this
      return {
        Android: function () {
          return navigator.userAgent.match(/Android/i)
        },
        BlackBerry: function () {
          return navigator.userAgent.match(/BlackBerry/i)
        },
        iOS: function () {
          return navigator.userAgent.match(/iPhone|iPad|iPod/i)
        },
        Opera: function () {
          return navigator.userAgent.match(/Opera Mini/i)
        },
        Windows: function () {
          return navigator.userAgent.match(/IEMobile/i)
        },
        any: function () {
          return (vm.isMobile().Android() || vm.isMobile().BlackBerry() || vm.isMobile().iOS() || vm.isMobile().Opera() || vm.isMobile().Windows())
        }
      }
    },

    /**
     * Return list of validation errors of a field
     *
     * @param field
     * @param types
     * @returns {Array}
     */
    validationMessageField (field, types) {
      types = types || ['required']
      const errors = []

      if (!field.$dirty) {
        return errors
      }

      if (types.indexOf('required') !== -1) {
        !field.required && errors.push(MESSAGES.VALIDATION_REQUIRED)
      }

      if (types.indexOf('email') !== -1) {
        !field.email && errors.push(MESSAGES.VALIDATION_EMAIL)
      }

      if (types.indexOf('minLength') !== -1) {
        !field.minLength && errors.push(MESSAGES.VALIDATION_MINLENGTH + field.$params.minLength.min)
      }

      if (types.indexOf('maxLength') !== -1) {
        !field.maxLength && errors.push(MESSAGES.VALIDATION_MAXLENGTH + field.$params.maxLength.max)
      }

      if (types.indexOf('sameAsPassword') !== -1) {
        !field.sameAsPassword && errors.push(MESSAGES.VALIDATION_SAMEPASSWORD)
      }

      if (types.indexOf('validCPF') !== -1) {
        !field.validCPF && errors.push(MESSAGES.VALIDATION_CPF)
      }

      return errors
    },

    ucwords (value) {
      if (!value) return ''
      value = value.toString().toLowerCase()
      return (value + '').replace(/^(.)|\s+(.)/g, function ($1) {
        return $1.toUpperCase()
      })
    },

    humanizeDuration (duration) {
      duration = parseInt(duration, 10) // don't forget the second param

      let hours = Math.floor(duration / 3600)
      let minutes = Math.floor((duration - (hours * 3600)) / 60)
      let seconds = duration - (hours * 3600) - (minutes * 60)

      if (hours < 10) {
        hours = '0' + hours
      }

      if (minutes < 10) {
        minutes = '0' + minutes
      }

      if (seconds < 10) {
        seconds = '0' + seconds
      }

      return hours + ':' + minutes + ':' + seconds
    }
  }
}
