// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 导入elementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// vue配置elementUI
Vue.use(ElementUI)

Vue.config.productionTip = false

/* 实例化vue */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})