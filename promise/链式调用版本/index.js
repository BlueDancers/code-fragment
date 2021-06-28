const PEDDING = 'pending' // 等待状态
const FULFILLED = 'fulfilled' // 成功状态
const REJECTED = 'rejected' // 失败状态
/**
 * then可能返回的是普通值,也可能返回一个promise
 * @param {*} promise 当前promise
 * @param {*} x 当前返回值
 * @param {*} resolve 成功回调
 * @param {*} reject 失败回调
 * @returns
 */
const resolvePromise = (promise, x, resolve, reject) => {
  if (promise === x) {
    return reject(new TypeError('检测到promise的循环调用')) // 'Chaining cycle detected for promise #<Promise>'
  }
  let called = false
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    try {
      const then = x.then
      if (typeof then === 'function') {
        then.call(
          x,
          (y) => {
            if (called) return
            called = true
            resolvePromise(promise, y, resolve, reject)
          },
          (r) => {
            if (called) return
            called = true
            reject(r)
          }
        )
      } else {
        resolve(x)
      }
    } catch (err) {
      if (called) return
      called = true
      reject(err)
    }
  } else {
    resolve(x)
  }
}

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
      REJECTED(error)
    }
  }

  then(onFulfilled, onRejected) {
    // 值穿透问题 如果then是空的话,就手动的将上一个resolve的值带入到下一个then中
    onFulfilled = typeof onFulfilled == 'function' ? onFulfilled : (value) => value
    onRejected =
      typeof onRejected == 'function'
        ? onRejected
        : (err) => {
            throw err
          }
    let apromise = new APromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value)
            resolvePromise(apromise, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        }, 0)
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason)
            resolvePromise(apromise, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        }, 0)
      }
      if (this.status === PEDDING) {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value)
              resolvePromise(apromise, x, resolve, reject)
            } catch (err) {
              reject(err)
            }
          }, 0)
        })
        this.onRejectCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason)
              resolvePromise(apromise, x, resolve, reject)
            } catch (err) {
              reject(err)
            }
          }, 0)
        })
      }
    })
    return apromise
  }
}

/**
 * 失败回调,因为是实例化后的,所以需要挂载在原型
 * @param {Function} errCallback
 * @returns
 */
APromise.prototype.catch = function (errCallback) {
  return this.then(null, errCallback)
}

new APromise((resolve, reject) => {
  setTimeout(() => {
    resolve(1111)
  }, 1000)
})
  .then((data) => {
    return new APromise((resolve, reject) => {
      setTimeout(() => {
        resolve(data)
      }, 1000)
    })
  })
  .then((text) => {
    console.log('text', text)
    return text
  })
  .catch((err) => {
    console.log('请求失败了', err)
  })

APromise.defer = APromise.deferred = function () {
  let dfd = {}
  dfd.promise = new APromise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}

module.exports = APromise
