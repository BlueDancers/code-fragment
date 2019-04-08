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
2. 保存 .then 里面的回调信息,因为不知道什么时候会用到
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









