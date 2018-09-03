var data = {
  name: 'mvvm'
}
observer(data)
data.name = 'mmm'

function observer (data) {
  if (!data || typeof data !== 'object') {
    return
  }
  // 此方法罗列出对象的所有属性名
  Object.keys(data).forEach((key)=> {
    defineEeactive(data, key, data[key])
  })
}

function defineEeactive (data, key, val) {
  var dep = new dep()
  observer(val) //监听子属性

  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: false,
    get: function() {
      Dep.target && dep.addDep(Dep.target) // 由于需要在闭包里面添加watcher,所以通过dep定义一个全局变量target属性,暂存watcher,添加完成后移除
      return val
    },
    set: function (newVal) {
      console.log('监听数据')
      val = newVal
      dep.notify() // 通知所有订阅者
    }
  })
}

Watcher.prototype = {
  get: function (key) {
    Dep.target = this
    this.value = data[key] // 这里会触发getters时间 从而添加订阅者
    Dep.target = null
  }
}

function Dep () {
  this.subs = [];
}
Dep.prototype = {
  addSub: function (sub) {
    this.subs.push(sub)
  },
  notify: function () {
    this.subs.forEach(function (sub) {
      sub.update()
    })
  }
}
