import { VueConstructor } from 'vue'

export class Store {
  _actions: any
  _mutations: any
  _getters: any
  _vm: any
  _committing: Boolean
  constructor(options: any) {
    let state = options.state
    this._committing = false
    this._actions = Object.create(null)
    this._mutations = Object.create(null)
    this._getters = Object.create(null)
    register(this, {
      getters: options.getters,
      mutations: options.mutations,
      actions: options.actions
    })
    processState(this, state)
    // 防止this被重写.这里强制commit指向当前this
    const storeThis = this
    let { commit, dispatch } = this
    // 固定this
    this.commit = (type, payload) => {
      return commit.call(storeThis, type, payload)
    }
    this.dispatch = (type, payload) => {
      return dispatch.call(storeThis, type, payload)
    }
  }
  get state() {
    // vuex的值发生变化的时候自动更新页面
    return this._vm.$data.$$mystore
  }

  // 实现commit提交state
  commit(type: string, payload: any) {
    const commitFun = this._mutations[type]
    this._withCommit(() => {
      commitFun(payload)
    })
  }

  // 实现dispatch异步提交state
  dispatch(type: any, payload: any) {
    const handler = this._actions[type]
    console.log(payload)
    handler(payload)
  }

  _withCommit(fn: Function) {
    this._committing = true
    fn()
    this._committing = false
  }
}

function register(store: any, options: any) {
  // 注册getters,这里遍历gettets对象,将 键 函数都传值到处理函数
  Object.keys(options.getters).forEach((type: string) => {
    store._getters[type] = () => {
      return options.getters[type](store.state)
    }
  })
  // 注册mutations
  Object.keys(options.mutations).forEach((type: string) => {
    store._mutations[type] = (payload: any) => {
      // options.mutations[type].call(store, store.state, payload)
      options.mutations[type](store.state, payload)
    }
  })
  // 注册actions
  Object.keys(options.actions).forEach((type: string) => {
    store._actions[type] = (payload: any) => {
      options.actions[type].call(
        store,
        {
          dispatch: store.dispatch,
          commit: store.commit,
          getters: store.getters,
          state: store.state
        },
        payload
      )
    }
  })
}

/**
 * 讲state处理成为响应式数据
 * @param store
 * @param state
 */
function processState(store: any, state: object) {
  store.getters = {}
  let computed: any = {}
  let getters = store._getters
  Object.keys(getters).forEach(key => {
    // 将getters数据与complate进行连接,获取getters实际运行至
    computed[key] = () => getters[key]()
    //getters数据响应式开启,并且get()事件发生后都直接访问到computed,继而触发更新
    Object.defineProperty(store.getters, key, {
      enumerable: true,
      get: () => store._vm[key]
    })
  })
  store._vm = new _Vue({
    // 使用vue 自带的响应式进行vuex的数据监听
    data: {
      $$mystore: state
    },
    computed
    // watch: {
    //   $$mystore: {
    //     handler: function() {
    //       console.log('变化')
    //       throw new Error('只允许mutation修改')
    //     },
    //     deep: true
    //   }
    // }
  })
  store._vm.$watch(
    function(this: any) {
      return (this as any)._data.$$mystore
    },
    () => {
      if (!store._committing) {
        console.log(store._committing)

        throw new Error('state 只能通过mutation修改')
      }
    },
    {
      deep: true,
      sync: true
    }
  )
}

/***
 * 注册函数
 */
let _Vue: VueConstructor
export function install(Vue: VueConstructor) {
  _Vue = Vue
  Vue.mixin({
    beforeCreate() {
      // 每次组件进行挂载都会进行一次beforeCreate的生命周期
      // 所以判断只有第一次的时候才进行,后面的依旧引用之前的或者是进行再次引用
      const options: any = this.$options
      if (options.myStore) {
        this.$mystore = options.myStore
      } else if (options.parent && options.parent.$mystore) {
        this.$mystore = options.parent.$mystore
      }
    }
  })
}
