import axios from 'axios'
import Vue from 'vue'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import TreeTable from 'vue-table-with-tree-grid'
import App from './App.vue'
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
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
// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)
// 过滤器，时间格式的转化，originVal需要处理的时间，月默认从0开始，所以+1，padStart(2, '0')，第一个参数总行多少位，2参数代表如不足两位，则以0填充
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
