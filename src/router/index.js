import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'main',
    component: HomeView
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import( '../views/Auth.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const getRole = localStorage.getItem('role') // получение роли для того, чтобы понять:
  if (to.name !== 'auth' && !getRole) { // если роль не сохранена и пытается попасть на главную страницу - перенаправлять на страницу авторизации
    next({ name: 'auth' })
  }
  else if (to.name === 'auth' && getRole) { //  если роль сохранена и пытается попасть на страницу авторизации, значит, пользователь - авторизован и его перенаправлять на главную страницу (она же, в данном случае, Контакты)
    next({name: 'main'})
  }
  else {
    next()
  }
})

export default router
