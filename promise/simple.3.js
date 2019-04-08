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
        this.status = resolved;
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
      this.successStore.push(() => {
        onFulfilledCallbacks(this.value);
      });

      this.failStore.push(() => {
        onRejectedCallvacks(this.reason);
      });
    }
    if (this.status === resolved) {
      Wpromise2 = new Wpromise((resolve, reject) => {
        try {
          let res = onFulfilledCallbacks(this.value);
          handlePromise(Wpromise, res, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    }
    if (this.status === rejected) {
      onRejectedCallvacks(this.reason);
    }
  }
}

function handlePromise(Wpromise2, res, resolve, reject) {
  console.log(Wpromise2, res, resolve, reject);
  // 后面再写吧
}

module.exports = Wpromise;
