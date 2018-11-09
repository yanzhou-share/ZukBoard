import Router from 'vue-router'
import Vue from 'vue'

const loadPage = (filename) => {
  console.log(`../pages/${filename}`)
  return require(`../pages/${filename}.vue`).default
}
Vue.use(Router)

const router = new Router({
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
        meta: { auth: true, keepAlive: false },
        component: loadPage('front/login')
      },
      {
        path: 'create/',
        name: 'createlesson',
        meta: { auth: true, keepAlive: true },
        component: loadPage('front/create')
      }
    ]
  },
  {
    path: '/imclass/classin/:id',
    name: 'classin',
    // redirect: '/app/canvas',
    meta: { auth: true, keepAlive: true },
    component: loadPage('classin/index')
  }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(m => m.meta.auth)) {
    if (to.name === 'login') {
      if (localStorage.getItem('userInfo')) {
        next('/imclass/front/create')
      }
      next()
    } else if (to.name !== 'login/') {
      if (localStorage.getItem('userInfo') || !!to.query.userType) {
        next()
      } else {
        next('/imclass/front/login/')
      }
    }
  }
  next()
})

export default router
