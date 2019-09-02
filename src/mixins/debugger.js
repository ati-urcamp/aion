export default (enable = false) => {
  function formatTime (timeInMs) {
    let date = new Date(timeInMs)
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`
  }

  function log (type, ...args) {
    if (enable) {
      console[type](`%c[${this.$_id}]${formatTime(Date.now())}>> `,
        `background:${type === 'log' ? '#384A5E' : type === 'warn' ? '#F1BF39' : '#FF5370'}; padding: 3px; border-radius: 3px;  color: #fff`,
        ...args,
        this.$el
      )
    }
  }

  return {
    created () {
      this.$_id = `${this.$options.name}-${(Date.now()).toString(32)}`
      this.log('debug ON')
    },
    methods: {
      log (...args) {
        log.call(this, 'log', ...args)
      },
      warn (...args) {
        log.call(this, 'warn', ...args)
      },
      error (...args) {
        log.call(this, 'error', ...args)
      }
    }
  }
}

// mixins: [debuggerMixin(true)],
