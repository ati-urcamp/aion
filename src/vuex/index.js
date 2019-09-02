import Vue from 'vue'
import Vuex from 'vuex'
// global resources
import state from './state'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'
// module resources
import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: false,
  state,
  mutations,
  getters,
  actions,
  modules
})
