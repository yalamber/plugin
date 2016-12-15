import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './components/App.vue'
import Dashboard from './components/Dashboard.vue'
import Login from './components/Login.vue'
import Record from './components/Record.vue'

Vue.use(VueRouter)



const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Dashboard },
    { path: '/login', component: Login },
    { path: '/record', component: Record },
  ]
})



new Vue({
  el: '#app',
  router,
  render: h => h(App)
})