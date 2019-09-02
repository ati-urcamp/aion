import '@fortawesome/fontawesome-free/css/all.css'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'vuetify/dist/vuetify.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'v-currency-field/dist/index.css'

import Vue from 'vue'
import App from './app/components/main/App.vue'
import router from './router'
import store from './vuex'
import http from './http'
import Vuetify from 'vuetify'
import VueSweetAlert from 'vue-sweetalert'
import Vuelidate from 'vuelidate'
import VueTheMask from 'vue-the-mask'
import VueQuillEditor from 'vue-quill-editor'
import VueCurrencyField from 'v-currency-field'

import './app/filters'

Vue.config.productionTip = false

Vue.use(http, { router, store })
Vue.use(Vuetify, {
  theme: {
    primary: '#465e54'
  }
})
Vue.use(VueSweetAlert)
Vue.use(Vuelidate)
Vue.use(VueTheMask)
Vue.use(VueQuillEditor)
Vue.use(VueCurrencyField)

/**
 * Cria a instância do vue
 */
/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
