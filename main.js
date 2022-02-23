import App from './App'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'

import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

import store from './store'
Vue.prototype.$store = store

const app = new Vue({
	store,
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif