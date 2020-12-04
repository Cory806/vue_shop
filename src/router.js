import Vue from 'vue'
import VueRouter from 'vue-router'
//import order from './components/order/order.vue'
//import report from './components/report/report.vue'
const  report= () => import(/* webpackChunkName: "order_report" */ './components/report/report.vue')
const  order= () => import(/* webpackChunkName: "order_report" */ './components/order/order.vue')
//import rights from './components/power/rights.vue'
const  rights= () => import(/* webpackChunkName: "user_roles_rights" */ './components/power/rights.vue')
//import roles from './components/power/roles.vue'
const roles= () => import(/* webpackChunkName: "user_roles_rights" */ './components/power/roles.vue')
//import user from './components/user/user.vue'
const user= () => import(/* webpackChunkName: "user_roles_rights" */ './components/user/user.vue')
const add = () => import(/* webpackChunkName: "add_cate_list_params" */ './components/goods/add.vue')
//import cate from './components/goods/cate.vue'
const cate = () => import(/* webpackChunkName: "add_cate_list_params" */ './components/goods/cate.vue')
//import list from './components/goods/list.vue'
const list = () => import(/* webpackChunkName: "add_cate_list_params" */ './components/goods/list.vue')
//import params from './components/goods/params.vue'
const params = () => import(/* webpackChunkName: "add_cate_list_params" */ './components/goods/params.vue')
const home = () => import(/* webpackChunkName: "login_home_welcome" */ './components/home.vue')

const login = () => import(/* webpackChunkName: "login_home_welcome" */ './components/login.vue')

const welcome = () => import(/* webpackChunkName: "login_home_welcome" */ './components/welcome.vue')
Vue.use(VueRouter)

const routes = [
      
       {path:'/',redirect: '/login'},
        {path:"/login" ,component:login},
        {
          path:'/home' ,
          component:home,
          redirect:'/welcome',
        children: [
          { path:'/welcome',component: welcome },
          { path: '/users', component: user },
          { path: '/rights', component: rights },
          { path: '/roles', component: roles },
          { path: '/categories', component: cate },
          { path: '/params', component: params },
          { path: '/goods', component: list },
          { path: '/goods/add', component: add },
          { path: '/orders', component: order },
          { path: '/reports', component: report }
         ]
        }

      ]
      const router = new VueRouter({
        routes
      })
      

  // 挂载路由导航守卫
  router.beforeEach((to, from, next) => {
    // to 将要访问的路径
    // from 代表从哪个路径跳转而来
    // next 是一个函数，表示放行
    //     next()  放行    next('/login')  强制跳转
    if(to.path ==='/login') return next()
    
    
      const tokenStr = window.sessionStorage.getItem('token');
      if(!tokenStr) return next('/login')
      next()
      
    
  
  
  
  
  })

export default router
