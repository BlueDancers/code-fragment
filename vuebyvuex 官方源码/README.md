# 对vuex的源码的查阅的记录

从使用的第一行代码开始看

```javascript
import Vue from 'vue'
import Vuex from '../plugins/vuex-dev/src/index'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    num: 1
  }
})
```



### 注册

当我们new Vuex.Store的时候

会进入Store的constructor中

首先会进行vuex的全局注册

```javascript
 if (!Vue && typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
 }
 // .......省略
 export function install (_Vue) {
  if (Vue && _Vue === Vue) {
    // 判断是否重复注册了，如果已经注册开发环境则进行警告
    // 如果没有注册的情况下，就会执行applyMixin
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      )
    }
    return
  }
  Vue = _Vue
  applyMixin(Vue)
}
```



`src/mixin.js`

> 在mixin中进行了vuex的全局注册
>
> 让我们可以在vue项目中的组件中方便的访问到vuex实例

````js
// vuex初始化的地方
export default function(Vue) {
  const version = Number(Vue.version.split('.')[0])
  // 判断当前vue当前版本是不是2.x 是的话才初始化vuex
  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    // 覆盖init并注入vuex init程序
    // 1.x向后兼容。
    const _init = Vue.prototype._init
    Vue.prototype._init = function(options = {}) {
      options.init = options.init ? [vuexInit].concat(options.init) : vuexInit
      _init.call(this, options)
    }
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit() {
    const options = this.$options
    // 注册store
    // 判断是否是页面,是页面才进行挂载
    if (options.store) {
      // 一般情况下不会是对象,不知道为什么需要判断对象
      // 父级组件进行$store的挂载
      this.$store =
        typeof options.store === 'function' ? options.store() : options.store
    } else if (options.parent && options.parent.$store) {
      // 子组件使用父组件的vuex实例
      this.$store = options.parent.$store
    }
  }
}
````

