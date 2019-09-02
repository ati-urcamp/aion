import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'

import beforeEach from './beforeEach'
import afterEach from './afterEach'

Vue.use(VueRouter)

const router = new VueRouter(
  {
    mode: 'history',
    routes
  }
)

// Execute before enter routes
router.beforeEach(beforeEach)

// Execute after enter routes
router.afterEach(afterEach)

export default router
