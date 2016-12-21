import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource';
import App from './components/App.vue'
import Dashboard from './components/Dashboard.vue'
import Login from './components/Login.vue'
import Screening from './components/Screening.vue'
import Test from './components/Test.vue'
import Record from './components/Record.vue'

Vue.use(VueRouter)
Vue.use(VueResource);


const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/', component: Login },
    { path: '/dashboard', component: Dashboard },
    { path: '/screening/:test_id', component: Screening },
    { path: '/test/:test_id', component: Test },
    { path: '/record/:test_id', component: Record },
    { path: '*', redirect: '/' }
  ]
})



new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
