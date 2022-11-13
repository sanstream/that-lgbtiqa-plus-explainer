import Vue from 'vue'
import SDS from 'sanstream-design-system'
import App from './App'
import VueRouter from 'vue-router'

Vue.config.productionTip = false

Vue.use(SDS)
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
