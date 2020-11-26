import axios from 'axios'
import Vue from 'vue'
import TreeTable from 'vue-table-with-tree-grid'
import App from './App.vue'
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
import './plugins/element.js'
import router from './router'


// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//请求拦截器
axios.interceptors.request.use(config => {
config.headers.Authorization = window.sessionStorage.getItem('token')
return config;
})
//把axios放到原型，则可以全局调用
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
