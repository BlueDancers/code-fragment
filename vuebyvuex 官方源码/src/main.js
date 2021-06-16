/*
 * @Author: your name
 * @Date: 2020-04-10 17:28:56
 * @LastEditTime: 2020-04-11 20:19:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vuebyvuex/src/main.js
 */
import Vue from 'vue'
import App from './App.vue'
import store from './store/index'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
