/* function Observer (data) {
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
    console.log("observer挂载data");
    this.defineReactive(this.data, key, value)
  },
  defineReactive: function (data, key, value) {
    var dep = new Dispatcher()
    var childObj = observer(value)
    console.log(data, key)
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
        val = newValue
        observer(newValue)
        console.log("observer 执行");
        
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
    this.watchers.forEach(function (watcher) {
      watcher.update()
    })
  }
}

Dispatcher.target = null */

function Observer(data) {
  this.data = data;
  this.walk(data);
}

Observer.prototype = {
  walk: function (data) {
    var me = this;
    Object.keys(data).forEach(function (key) {
      me.convert(key, data[key]);
    });
  },
  convert: function (key, val) {
    console.log("observer挂载data");
    this.defineReactive(this.data, key, val);
  },

  defineReactive: function (data, key, val) {
    var dep = new Dispatcher();
    observer(val);
    console.log(data, key)
    Object.defineProperty(data, key, {
      enumerable: true, // 可枚举
      configurable: false, // 不能再define
      get: function () {
        if (Dispatcher.target) {
          dep.depend();
        }
        return val;
      },
      set: function (newVal) {
        if (newVal === val) {
          return;
        }
        console.log("observer set 执行");
        val = newVal;
        // 新的值是object的话，进行监听
        observer(newVal);
        // 通知订阅者
        dep.notify();
      }
    });
  }
};

function observer(value) {
  if (!value || typeof value !== 'object') {
    return;
  }
  return new Observer(value);
};


var uid = 0;

function Dispatcher() {
  this.id = uid++;
  this.watchers = [];
}

Dispatcher.prototype = {
  addSub: function (sub) {
    this.watchers.push(sub);
  },

  depend: function () {
    Dispatcher.target.addDep(this);
  },

  notify: function () {
    this.watchers.forEach(function (watcher) {
      watcher.update();
    });
  },

  removeSub: function (sub) {
    var index = this.watchers.indexOf(sub);
    if (index != -1) {
      this.watchers.splice(index, 1);
    }
  }
};

Dispatcher.target = null;