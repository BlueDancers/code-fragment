const pending = 'pending'
const resolved = 'resolved'
const rejected = 'rejected'

class Wpromise {
  constructor(fn) {
    
    this.status = pending
    this.value = null
    this.reason = null
    this.onFulfilledCallbacks = []
    this.onRejectedCallvacks = []

    let resolve = value => {
      if (this.status === pending) {
        this.value = value
        this.status = resolved
      }
    }

    let reject = reason => {
      if (this.status === pending) {
        this.reason = reason
        this.status = resolved
      }
    }
    // 将声明的resolve reject作为参数传入new Promise()里面,这样就可以调用resolve reject 函数了
    fn(resolve, reject)


  }
  then(onFulfilledCallbacks,onRejectedCallvacks) {
    if(this.status === resolved) {
      onFulfilledCallbacks(this.value)
    }
    if (this.status === rejected) {
      onRejectedCallvacks(this.reason)
    }
  }
}

module.exports = Wpromise;
