import Vue from 'vue'
import VueRouter from 'vue-router'
import home from './components/home.vue'
import login from './components/login.vue'
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
          { path: '/users', component: user }
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