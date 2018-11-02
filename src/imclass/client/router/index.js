import Router from 'vue-router'
import Vue from 'vue'

const loadPage = (filename) => {
  console.log(`../pages/${filename}`)
  return require(`../pages/${filename}.vue`).default
}
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/imclass/front',
    name: 'front',
    // redirect: '/app/canvas',
    component: loadPage('front/index'),
    children: [
      {
        path: 'login/',
        name: 'login',
        component: loadPage('front/login')
      }
    ]
  },
  {
    path: '/imclass/classin',
    name: 'front',
    // redirect: '/app/canvas',
    component: loadPage('classin/index')
  }
  ]
})
