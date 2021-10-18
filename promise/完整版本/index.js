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
      // console.log('当前状态', this.status, data)
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
 * 实现resolve
 * @param {*} data
 * @returns
 */
APromise.resolve = function (data) {
  return new APromise((resolve, reject) => {
    resolve(data)
  })
}

/**
 * 实现reject
 * @param {*} data
 * @returns
 */
APromise.reject = function (data) {
  return new APromise((resolve, reject) => {
    reject(data)
  })
}

/**
 * 失败回调,因为是实例化后的,所以需要挂载在原型
 * @param {Function} errCallback
 * @returns
 */
APromise.prototype.catch = function (errCallback) {
  return this.then(null, errCallback)
}

/**
 * 不论成功失败的回调
 * @param {*} callBack
 * @returns
 */
APromise.prototype.finally = function (callBack) {
  return this.then(
    (data) => {
      return APromise.resolve(callBack()).then(() => data)
    },
    (err) => {
      return APromise.reject(callBack()).then(() => {
        throw err
      })
    }
  )
}

/**
 * 同时执行多个promise,但是最返回最先返回的结果
 * @param {*} promiseList
 * @returns
 */
APromise.race = function (promiseList) {
  if (!Array.isArray(promiseList)) {
    throw new TypeError('必须传递数组')
  }
  return new APromise((resolve, reject) => {
    promiseList.forEach((item) => {
      if (item && typeof item.then == 'function') {
        item.then(resolve, reject)
      } else {
        resolve(item)
      }
    })
  })
}

/**
 * 同时执行多个promise,会等待每次promise的结果,最后一起返回,有一个失败,这都不会返回
 * @param {} promiseList
 * @returns
 */
APromise.all = function (promiseList) {
  if (!Array.isArray(promiseList)) {
    throw new TypeError('必须是数组')
  }
  return new APromise((resolve, reject) => {
    const resulteArr = []
    const len = promiseList.length
    let currentIndex = 0
    const getResult = (key, val) => {
      resulteArr[key] = val
      if (++currentIndex == len) {
        resolve(resulteArr)
      }
    }
    for (let i = 0; i < len; i++) {
      const val = promiseList[i]
      if (val && typeof val.then === 'function') {
        val.then((data) => {
          getResult(i, data)
        }, reject)
      } else {
        getResult(i, val)
      }
    }
  })
}

/**
 * any与all完全相反,只要有个一个成功就会返回成功,全部失败才会返回失败
 * @param {*} promiseList
 * @returns
 */
APromise.any = function (promiseList) {
  if (!Array.isArray(promiseList)) {
    throw new TypeError('必须是数组')
  }
  return new APromise((resolve, reject) => {
    const resultArr = []
    const len = promiseList.length
    let currentIndex = 0
    const getResult = (index, err) => {
      resultArr[index] = err
      if (++currentIndex == len) {
        reject(resultArr)
      }
    }
    promiseList.map((res, index) => {
      if (res && typeof res.then == 'function') {
        res.then(resolve, (err) => {
          getResult(index, err)
        })
      } else {
        resolve(res)
      }
    })
  })
}

/**
 * 保存所有的成功与失败
 * @param {*} promiseList
 * @returns
 */
APromise.allSettled = function (promiseList) {
  if (!Array.isArray(promiseList)) {
    throw new TypeError('必须是数组')
  }
  return new APromise((resolve, reject) => {
    const resultArr = []
    const len = promiseList.length
    let currentIndex = 0
    const getResult = (index, data, status) => {
      if (status == FULFILLED) {
        resultArr.push({
          status: status,
          value: data,
        })
      }
      if (status == REJECTED) {
        resultArr.push({
          status: status,
          reason: data,
        })
      }
      if (++currentIndex == len) {
        resolve(resultArr)
      }
    }
    promiseList.map((res, index) => {
      if (res && typeof res.then == 'function') {
        res.then(
          (data) => {
            getResult(index, data, FULFILLED)
          },
          (err) => {
            getResult(index, err, REJECTED)
          }
        )
      } else {
        getResult(index, res, FULFILLED)
      }
    })
  })
}

let p1 = new APromise((resolve, reject) => {
  setTimeout(() => {
    resolve('ok1')
  }, 3000)
})
let p2 = new APromise((resolve, reject) => {
  setTimeout(() => {
    resolve('ok2')
  }, 2000)
})

let p3 = new APromise((resolve, reject) => {
  setTimeout(() => {
    reject('err3')
  }, 1000)
})

let p4 = new APromise((resolve, reject) => {
  setTimeout(() => {
    reject('err4')
  }, 2000)
})

APromise.allSettled([1, 2, 3, p1, p2, p3, p4]).then((res) => {
  console.log('success', res)
})

// test any
// APromise.any([1, p3, p4]).then(
//   (data) => {
//     console.log('success', data)
//   },
//   (err) => {
//     console.log('error', err)
//   }
// )

// test all
// APromise.all([1, 2, 3, p1, p2]).then(
//   (data) => {
//     console.log('success', data)
//   },
//   (err) => {
//     console.log('error', err)
//   }
// )

// test race
// APromise.race([1, p1, p2]).then(
//   (data) => {
//     console.log('success1', data)
//   },
//   (err) => {
//     console.log('error1', err)
//   }
// )

// 测试链式调用
// new APromise((resolve, reject) => {
//   setTimeout(() => {
//     resolve(1111)
//   }, 1000)
// })
//   .then((data) => {
//     return new APromise((resolve, reject) => {
//       setTimeout(() => {
//         resolve(data)
//       }, 1000)
//     })
//   })
//   .then((text) => {
//     console.log('text', text)
//     return text
//   })
//   .finally((res) => {
//     console.log('执行完毕', res)
//   })
//   .catch((err) => {
//     console.log('请求失败了', err)
//   })

// console.log(
//   APromise.resolve(2).then(
//     () => {},
//     () => {}
//   )
// )
// 返回值为undefined
// console.log(
//   APromise.resolve(2).finally(
//     () => {},
//     () => {}
//   )
// )
// 返回值为2

new Promise((resolve, reject) => {
  resolve(11111)
})
  .then((res) => {
    return res
  })
  .finally(() => {
    console.log(111)
  })
  .then((data) => {
    console.log(data)
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
