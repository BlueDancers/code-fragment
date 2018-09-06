function Observer (data) {
  this.data = data
  this.walk(data)
}

Observer.prototype = {
  walk: function (data) {
    var me = this
    Object.keys(data).forEach(function (key) {      
      me.convers(key, data[key])  // data里面的键值对
    })
  },
  convers: function (key, value) {
    this.defineReactive(this.data, key, value)
  },
  
  defineReactive: function (data, key, value) {
    var dep = new Dispatcher()
    observer(value)
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: false,
      get: function () {
        if (Dispatcher.target) {
          dep.depend()
        }
        return value
      },
      set: function (newValue) {
        if (newValue === value) return;
        value = newValue
        observer(newValue)
        dep.notify()
      }
    })
  }
}

function observer (data) {
  if (!data || typeof data !== 'object') { // 如果data不存在或者data不是object都直接返回
    return
  }
  return new Observer(data) // 假如是对象就给他添加get set方法
}

var uid = 0;
function Dispatcher() {
  this.id = uid++
  this.watchers = []
}
Dispatcher.prototype = {
  addSub: function (sub) {
    this.watchers.push(sub)
  },
  depend: function () {
    Dispatcher.target.addDep(this)
  },
  removeSub: function (sub) {
    var index = this.watchers.indexOf(sub)
    if (index != -1) {
      this.watchers.splice(index, 1)
    }
  },
  notify: function () {
    console.log(this.watchers);
    
    this.watchers.forEach(function (watcher) {
      console.log(watcher);
      
      watcher.update()
    })
  }
}

Dispatcher.target = null
