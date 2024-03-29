import 'sanstream-design-system/src/tokens.css'
import 'sanstream-design-system/src/layouts.css'
import Vue from 'vue'
import SDS from 'sanstream-design-system'
import App from './App'
import VueRouter from 'vue-router'

Vue.config.productionTip = false

Vue.use(SDS)
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      name: 'home',
      path: '/',
    },
  ],
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
