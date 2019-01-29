// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 导入elementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/index.css'
import axios from 'axios' // 导入axios

// vue配置elementUI插件 vue所有组件和vue实例都可以使用（相当于挂载到vue原型上）
Vue.use(ElementUI)

// 配置axios 配置到vue原型中  这样vue实例和组件实例就可以使用了
Vue.prototype.$http = axios
// 配置axios公共路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'
/**
 * 配置axios的请求和相应拦截器
 * 所有的请求和响应都会限制性拦截器方法
 */
// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    // 请求成功的处理回调
    // 统一设置 headers 中的 Authorization 属性的 token值
    // 需要判断请求地址是否是登录界面 如果是则不要加token值
    if (!config.url.endsWith('/login')) {
      config.headers['Authorization'] = localStorage.getItem('token')
    }
    return config
  },
  function (error) {
    // Do something with request error
    // 请求失败的处理回调
    return Promise.reject(error)
  }
)

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    // 响应成功的处理回调
    // 统一处理响应后的信息
    if (response.data.meta.status === 401) {
      // 默认跳转登录页
      // 清除token值
      router.push('/login')
      localStorage.removeItem('token')
    }
    return response
  },
  function (error) {
    // Do something with response error
    // 响应成功的处理回调
    return Promise.reject(error)
  }
)

Vue.config.productionTip = false

/* 实例化vue */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
