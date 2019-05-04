const pending = 'pending';
const resolved = 'resolved';
const rejected = 'rejected';
/**
 * 处理值穿透问题
 */
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
  /**
   *
   *
   * @param {Function} onFulfilledCallbacks then(res => {}) // 第一个回调函数
   * @param {Function} onRejectedCallvacks then(()=>(), err=> {}) // 第二个回调函数
   * @returns
   * @memberof Wpromise
   */
  then(onFulfilledCallbacks, onRejectedCallvacks) {
    onFulfilledCallbacks =
      typeof onFulfilledCallbacks === 'function'
        ? onFulfilledCallbacks
        : y => y;
    // y => y 意思为 y => {return y} // 当then中不存在函数的时候,我们就需要手动的返回上层的值 在实际函数中就是 .then(res => {return res})

    typeof onRejectedCallvacks === 'function'
      ? onRejectedCallvacks
      : e => {
          throw e;
        };
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
      Wpromise2 = new Wpromise((resolve, reject) => {
        try {
          let res = onRejectedCallvacks(this.value); // 是then的返回值 可能为null 普通值 或者函数
          handlePromise(Wpromise, res, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    }
    return Wpromise2; //返回新的promise
  }
  catch(onRejectedCallvacks) {
    this.then(null, onRejectedCallvacks);
  }
}
Wpromise.resolve = function(val) {
  return new Wpromise((resolve, reject) => resolve(val));
};
Wpromise.reject = function(val) {
  return new Wpromise((resolve, reject) => reject(val));
};

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
