## promise的逐步实现

Promise不多说了,目前依旧是解决异步的主流方案,网络上的源码解读也是多如牛毛,本文不做赘述,只阐述原理,与代码





### 第一版本(不支持异步的Promise)

````javascript
const pending = 'pending';
const resolved = 'resolved';
const rejected = 'rejected';

class Wpromise {
  constructor(fn) {
    this.status = pending; // 初始状态为等待状态
    this.value = null; // 正确回调信息
    this.reason = null; // 错误回调信息

    let resolve = value => { // 当执行 resolve(value) 就会执行这个函数
      if (this.status === pending) {
        this.value = value;
        this.status = resolved;
      }
    };

    let reject = reason => { // 当执行 reject(value) 就会执行这个函数
      if (this.status === pending) {
        this.reason = reason;
        this.status = rejected;
      }
    };
    // 将声明的resolve reject作为参数传入new Promise()里面,这样就可以调用resolve reject 函数了
    fn(resolve, reject);
  }
  then(onFulfilledCallbacks, onRejectedCallvacks) {
    //then函数里面根据status来决定通过还是拒绝
    if (this.status === resolved) {
      onFulfilledCallbacks(this.value);
    }
    if (this.status === rejected) {
      onRejectedCallvacks(this.reason);
    }
  }
}

module.exports = Wpromise;
````

使用

```JavaScript
let Wpromise = require('./simple.1');

new Wpromise((resolve, reject) => {
  reject(1);
}).then(
  res => {
    console.log(res);
  },
  res => {
    console.log('失败', res);
  }
);
```

可以看到实现起来思路还是很清晰很巧妙的

我们可以看一下运行顺序图



![](http://www.vkcyan.top/FiO2OahzAwNW6E7P3x4coK6nIMvq.png)

思路很清晰~~





### 第二版本(支持异步)

> 当发生promise中使用异步的时候,就会开始事件循环,优先运行接下来的代码,也就是 .then函数,但是此时 状态值 依旧为 ""



解决方案

1. then里面需要处理 "pending"状态的处理
2. 保存 .then 里面的回调信息,等到异步结束的时候进行调用
3. 在resolve reject中对保存的回调信息进行处理



```javascript
const pending = 'pending';
const resolved = 'resolved';
const rejected = 'rejected';

class Wpromise {
  /**
   * @param {Object} fn 附带(resolve,reject) 的实例
   */
  constructor(fn) {
    this.status = pending;
    this.value = null;
    this.reason = null;
    this.successStore = []; // 定义一个存放成功函数的数组
    this.failStore = []; // 定义一个存放失败函数的数组

    let resolve = value => {
      // 只有status为pending的时候才能使用这个函数(防止重复调用)
      if (this.status === pending) {
        this.value = value; // 保存返回值
        this.status = resolved; // 修改状态为resolved状态
        this.successStore.forEach(fnc => fnc());
      }
    };

    let reject = reason => {
      // 基本原理与resolve差不多,都是只用pending才能进行调用
      if (this.status === pending) {
        this.reason = reason; //
        this.status = rejected;
        this.failStore.forEach(fnc => fnc());
      }
    };
    // 将声明的resolve reject作为参数传入new Promise()里面,这样就可以调用resolve reject 函数了
    fn(resolve, reject);
  }
  then(onFulfilledCallbacks, onRejectedCallvacks) {
    // 当是异步事事件的时候,status一定为pending 此时并不知道异步完成后是
    // 成功 还是失败,所以用一个数组将成功回调 失败回调存储起来
    // 等到异步事件执行完毕 就会存在状态,并且执行 相应事件
    // 然后赋值 修改状态 并且循环执行.then 里面的回调事件
    if (this.status === pending) {
      this.successStore.push(() => {
        onFulfilledCallbacks(this.value);
      });

      this.failStore.push(() => {
        onRejectedCallvacks(this.reason);
      });
    }
    if (this.status === resolved) {
      onFulfilledCallbacks(this.value);
    }
    if (this.status === rejected) {
      onRejectedCallvacks(this.reason);
    }
  }
}
module.exports = Wpromise;
```



````JavaScript
let Wpromise = require('./simple');
new Wpromise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功');
  }, 1000);
}).then(
  res => {
    console.log(res);
  },
  res => {
    console.log('失败', res);
  }
);
````

尝试画一下运行思路图

![](http://www.vkcyan.top/FmV50N-3zmNJmd-xM8JEahDw8yJy.png)

完美解决异步问题



第三版本(支持链式调用)

源码实现非常巧妙,也比较复杂,核心就是使用call来进行then的递归调用 实现链式.then的调用



基本思路如下: 

1. 在`.then`的时候判断当前状态值 假设为`resolved` 获取当前promise中的`this.value`也就是返回值
2. 将成功回调进行再次Promise处理,并进行链式调用处理,最后返回这个Promise对象,以便于下次调用
3. 如果`.then`是同步的直接`resolve`,便于后面的`.then`调用
4. 如果`.then`是异步的,这进行手动.then处理,同时将当前this传递进去,再次进行promise处理,直到异步完成,执行resolve方法

**看起来肯定很绕,因为实现起来就是这么绕...**

![](http://www.vkcyan.top/FvIyA12Vcan-N3pET5S5EmBT_wjZ.png)



```JavaScript
const pending = 'pending';
const resolved = 'resolved';
const rejected = 'rejected';

class Wpromise {
  /**
   * @param {Object} fn 附带(resolve,reject) 的实例
   */
  constructor(fn) {
    this.status = pending;
    this.value = null;
    this.reason = null;
    this.successStore = [];
    this.failStore = [];

    let resolve = value => {
      if (this.status === pending) {
        this.value = value;
        this.status = resolved; // 等到回调的数据得到后,在去执行异步的回调函数
        this.successStore.forEach(fnc => fnc());
      }
    };

    let reject = reason => {
      if (this.status === pending) {
        this.reason = reason; //
        this.status = rejected;
        this.failStore.forEach(fnc => fnc());
      }
    };
    try {
      fn(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  then(onFulfilledCallbacks, onRejectedCallvacks) {
    let Wpromise2;
    if (this.status === pending) {
      Wpromise2 = new Wpromise((resolve, reject) => {
        // 判断是否需要传递promise
        try {
          this.successStore.push(() => {
            let res = onFulfilledCallbacks(this.value);
            handlePromise(Wpromise2, res, resolve, reject);
          });
          this.failStore.push(() => {
            let res = onRejectedCallvacks(this.reason);
            handlePromise(Wpromise2, res, resolve, reject);
          });
        } catch (e) {
          reject(e);
        }
      });
      // 当为等待状态的时候,就存储当前的回调函数 当状态发生变化后再执行 达到同步的效果
    }
    if (this.status === resolved) {
      Wpromise2 = new Wpromise((resolve, reject) => {
        try {
          let res = onFulfilledCallbacks(this.value); // 是then的返回值 可能为null 普通值 或者函数
          handlePromise(Wpromise, res, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    }
    if (this.status === rejected) {
      onRejectedCallvacks(this.reason);
    }
    return Wpromise2; //返回新的promise
  }
}

/**
 * 拓展promise的作用域链 开启链式调用
 * @param {Function} Wpromise2 promise原型
 * @param {String} res 返回值
 * @param {Function} resolve 成功回调
 * @param {Function} reject 失败回调
 */
function handlePromise(Wpromise2, res, resolve, reject) {
  if (Wpromise2 == res) {
    // Wpromise 是否等于res,也就是判断是否将返回本身
    return reject(new TypeError('不能抛出本身'));
  }
  // 假如是函数的情况下
  if (res !== null && (typeof res === 'object' || typeof res === 'function')) {
    let called; // called控制resolve或reject只能执行一次,多次调用没有用
    try {
      let { then } = res;
      if (typeof then === 'function') {
        // then(res, onFulfilled, onRejected)
        // res 中的this.status是then里面需要的
        // y这个方法传到,then函数里面去就变成了function 在then再使用这个function并把value值传进来
        then.call(
          res,
          y => {
            if (called) return;
            handlePromise(Wpromise2, y, resolve, reject);
          },
          r => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      }
    } catch (error) {
      // 假如
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    //不是异步的情况下 不存在reject对象 直接resolve就可以了
    resolve(res);
  }
}

module.exports = Wpromise; 
```





