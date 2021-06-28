const PEDDING = 'pending' // 等待状态
const FULFILLED = 'fulfilled' // 成功状态
const REJECTED = 'rejected' // 失败状态

class APromise {
  constructor(executor) {
    this.status = PEDDING // 初始化状态
    this.value = undefined // 成功的数据
    this.reason = undefined // 失败的原因
    this.onFulfilledCallbacks = [] // 保存成功状态的回调队列
    this.onRejectCallbacks = [] // 保存失败状态的回调队列

    const resolve = (data) => {
      if (this.status == PEDDING) {
        this.status = FULFILLED
        this.value = data
      }
      this.onFulfilledCallbacks.map((e) => e())
    }

    const reject = (err) => {
      if (this.status == PEDDING) {
        this.status = REJECTED
        this.reason = err
      }
      this.onRejectCallbacks.map((e) => e())
    }
    try {
      executor(resolve, reject)
    } catch (error) {
      // 对于执行器执行过程中抛出的错误我们也使用reject进行抛出
      rejected(error)
    }
  }

  then(onFulfilled, onRejected) {
    if (this.status == FULFILLED) {
      onFulfilled(this.value)
    }
    if (this.status == REJECTED) {
      onRejected(this.reason)
    }
    if (this.status == PEDDING) {
      this.onFulfilledCallbacks.push(() => {
        onFulfilled(this.value)
      })
      this.onRejectCallbacks.push(() => {
        onRejected(this.reason)
      })
    }
  }
}

// 1.resolve, reject 从何而来
new APromise((resolve, reject) => {
  console.log('开始回调')
  setTimeout(() => {
    console.log('执行回调')
    resolve(11111)
  }, 1000)
}).then(
  (value) => {
    console.log('成功回调', value)
  },
  (err) => {
    console.log('失败回调', err)
  }
)
