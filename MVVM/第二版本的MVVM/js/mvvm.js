/* function MVVM (options) {
  this.$options = options
  var data = this._data = this.$options.data
  var me = this
  
  //数据代理
  Object.keys(data).forEach(function (key) { //返回一个所有元素为字符串的数组，其元素来自于从给定的object上面可直接枚举的属性。
    me._proxyData(me, key, data[key])
  })

  //初始化computed
  this._initComputed()

  //数据监听器 
  observer(data) // 数据变动第二到这里,因为data发生变化了

  //获取挂载点
  this.compile = new Compile(options.el || document.body, this)
}

MVVM.prototype = {
  _proxyData: function (me, key, value) {
    Object.defineProperty(me, key, {
      configurable: false,
      enumerable: true,
      get: function () {
        return value
      },
      set: function (newValue) { // 数据变动首先到这里 这里会改变data的值
        value = newValue
      }
    })
  },
  _initComputed: function () {
    var me = this;
    var computed = this.$options.computed;
    if (typeof computed === 'object') {
      Object.keys(computed).forEach(function(key) {
        
        Object.defineProperty(me, key, {
          get: typeof computed[key] === 'function' ? computed[key] : computed[key].get, // 有点看不懂
          set: function () {}
        })
      })
    }
  }
} */

function MVVM(options) {
  this.$options = options || {};
  var data = this._data = this.$options.data;
  var me = this;

  // 数据代理
  // 实现 vm.xxx -> vm._data.xxx
  Object.keys(data).forEach(function (key) {
    me._proxyData(key);
  });

  this._initComputed();

  observer(data, this);

  this.$compile = new Compile(options.el || document.body, this)
}

MVVM.prototype = {
  $watch: function (key, cb, options) {
    new Watcher(this, key, cb);
  },

  _proxyData: function (key) {
    var me = this;
    Object.defineProperty(me, key, {
      configurable: false,
      enumerable: true,
      get: function proxyGetter() {
        return me._data[key];
      },
      set: function proxySetter(newVal) {
        me._data[key] = newVal;
      }
    });
  },

  _initComputed: function () {
    var me = this;
    var computed = this.$options.computed;
    if (typeof computed === 'object') {
      Object.keys(computed).forEach(function (key) {
        Object.defineProperty(me, key, {
          get: typeof computed[key] === 'function' ?
            computed[key] : computed[key].get,
          set: function () {}
        });
      });
    }
  }
};