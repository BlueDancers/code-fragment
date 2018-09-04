var vm = {
  data: {
    message: 'no.1',
    username: 'Hello',
    password: 'World',
    quote: '!'
  },
  computed: {
    reverseMessage: function () {
      var message = this.message;
      return message.split('').reverse().join('');
    },
    sucker: function () {
      return 'username:' + this.username + ';password:' + this.password + this.quote;
    },
    test: 'Hello World!'
  }
};

var set = {};
var observeTarget = null;
observe(vm);

function observe(vm) {
  _initData(vm);
  _initComputed(vm);
}

function _initData(vm) {
  var data = vm.data;
  _walk(vm, data);
  _eval(vm, data);
}

function _initComputed(vm) {
  var computed = vm.computed;
  _walk(vm, computed);
  _eval(vm, computed);
}

function _walk(vm, data) {
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      set[key] = [];
      (function (key) {
        Object.defineProperty(vm, key, {
          enumerable: true,
          configurable: true,
          get: function () {
            if (set[key].indexOf(observeTarget) == -1) {
              set[key].push(observeTarget);
            }
            return isFunction(data[key]) ? data[key].call(vm) : data[key];
          },
          set: function (val) {
            if (isFunction(data[key])) {
              return;
            }
            if (set[key].indexOf(observeTarget) == -1) {
              set[key].push(observeTarget);
            }
            data[key] = val;
            set[key].forEach(function (item) {
              if (item != observeTarget) {
                if (isFunction(item)) {
                  item.call(vm);
                }
              }
            });
          }
        });
      }(key))
    }
  }
}

function _eval(vm, data) {
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      if (isFunction(data[key])) {
        observeTarget = key;
        data[key].call(vm);
      }
    }
  }
}

function isFunction(val) {
  return typeof val == "function";
}

vm.message = 'GoodBye';
console.log(vm.reverseMessage); // output: GoodBye0
console.log(vm.test); // output: Hello World

vm.username = 'zyEros02';
console.log(vm.sucker);

vm.password = 'zysuper';
vm.quote = '?';
console.log(vm.sucker);