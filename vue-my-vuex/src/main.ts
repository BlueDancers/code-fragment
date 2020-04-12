import Vue from 'vue'
import App from './App.vue'
import myStore from './store'
Vue.config.productionTip = false

new Vue({
  myStore,
  render: h => h(App)
}).$mount('#app')
