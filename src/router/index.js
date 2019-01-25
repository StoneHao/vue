import Vue from 'vue';
import Router from 'vue-router';
import Login from '../components/Login.vue';
//  安装路由插件 在webpack这样的模块化系统中，必须执行这一步 如果通过script引入则不需要
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
  ],
});
