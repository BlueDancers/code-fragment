/*
 * @Author: your name
 * @Date: 2020-04-11 20:14:21
 * @LastEditTime: 2020-04-11 20:18:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vuebyvuex/src/store/index.js
 */
import Vue from 'vue'
import Vuex from '../plugins/vuex-dev/src/index'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    num: 1
  }
})

export default store
