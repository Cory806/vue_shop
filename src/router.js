import Vue from 'vue'
import VueRouter from 'vue-router'
import add from './components/goods/add.vue'
import cate from './components/goods/cate.vue'
import list from './components/goods/list.vue'
import params from './components/goods/params.vue'
import home from './components/home.vue'
import login from './components/login.vue'
import rights from './components/power/rights.vue'
import roles from './components/power/roles.vue'
import user from './components/user/user.vue'
import welcome from './components/welcome.vue'
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
          { path: '/goods/add', component: add }
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
