import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.config.productionTip = false
import XLSX from 'xlsx'

Vue.use(ElementUI,XLSX)
router.beforeEach((to, from, next) => {
  // 判断用户有没有登录
  let is = localStorage.getItem('unknown');
  if (to.path == '/login') {
    next()
  } else {
    if (is != null) {
      next(vm => {
        vm.$store.push({
          name: 'content'
        })
      })
    } else {
      alert('你还没有登录,请你登录在进去')
      next('/login')
    }
  }

})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')