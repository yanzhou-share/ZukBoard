import '@babel/polyfill'
import Vue from 'vue'
import VueResource from 'vue-resource'
import VueAnalytics from 'vue-analytics'
import App from './App'
import router from './router'
import store from './store'
import './assets/css/common.css'
import './assets/css/style.css'
import Toast from './components/thirdparty/toast'
import VueClipboard from 'vue-clipboard2'
import ElementUI from 'element-ui'

const id = process.env.GA_ID

if (process.env.NODE_ENV !== 'development') {
  // eslint-disable-next-line
  __webpack_public_path__ = window.staticBaseUrl
}

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueResource)
Vue.use(Toast)
Vue.use(VueClipboard)

// If GA_ID exists, then enable Google Analytics
if (id !== undefined) {
  Vue.use(VueAnalytics, {
    id: id,
    autoTracking: {
      screenview: true
    },
    router
  })
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
