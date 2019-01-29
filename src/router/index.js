import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Users from '../components/Users'
//  安装路由插件 在webpack这样的模块化系统中，必须执行这一步 如果通过script引入则不需要
//  相当于将vue-router 动态挂载到了vue所有对象和组件的prototype原型上
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      children:
        [
          {
            path: 'users',
            component: Users
          }]
    }
  ]
})
/* 在路由文件中配置全局守卫
 *  0 访问是登陆页面直接next 不是的话就需要判断是否登陆成功
 *  1 当用户登陆成功，继续调用next()方法 不在拦截
 *  2 当用户登陆不成功，默认跳转next('/login')页面 进行拦截
 *     获取存储在localStorage中的token 以此来判断是否登陆成功
 * */
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    let token = localStorage.getItem('token')
    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
