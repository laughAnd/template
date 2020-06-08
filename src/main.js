// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import api from './http'
import i18n from './i18n'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'

import $ from 'jquery'
import 'signalr'// 推送

// import signalr from './utils/signalR'
// Vue.use(signalr)

// import echarts from 'echarts'
// Vue.prototype.$echarts = echarts  // 全局引入echarts 不推荐用

import echarts from './utils/echarts'  // 按需引入echarts
Vue.prototype.$echarts = echarts

import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import './assets/css/icon.css';

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(api)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  $,
  components: { App },
  template: '<App/>'
})
