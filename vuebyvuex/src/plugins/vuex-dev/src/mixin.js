/*
 * @Author: vkcyan
 * @Date: 2020-04-10 17:46:45
 * @LastEditTime: 2020-04-12 18:50:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /vuebyvuex/src/plugins/vuex-dev/src/mixin.js
 */
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
