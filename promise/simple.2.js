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
