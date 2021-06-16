import Vue from 'vue'
import myStore from '../my/index'

Vue.use(myStore)

export default new myStore.Store({
  state: {
    data: 1
  },
  mutations: {
    changeData(state: any, data: any) {
      state.data = data
    }
  },
  actions: {
    asnycChangeData({ commit, state }: any, data: any) {
      console.log('获取到了参数', data)
      setTimeout(() => {
        commit('changeData', data)
        // state.data = 312312312312 // 会报错
      }, 3000)
    }
  },
  modules: {},
  getters: {
    pushdata: (state: any, data: any) => {
      return `data为${state.data}`
    }
  }
})

// import Vue from 'vue'
// import Vuex from 'vuex';

// Vue.use(Vuex)

// export default new Vuex.Store({
//   state: {
//     data: 1
//   },
//   mutations: {
//   },
//   actions: {
//   },
//   modules: {
//   }
// })
