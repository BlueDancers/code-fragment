const effectStack = [] // 存储初始化时期的effect函数
const reactiveMap = new WeakMap() // 缓存已经代理过的对象
const targetMap = new WeakMap() // 缓存所有副作用函数的Map 这是一个WeakMap里面嵌套Map,Map里面嵌套Set的结构

/**
 * 对JavaScript对象进行处理,对对象进行劫持
 * @param {object} fn 监听对象
 */
function reactive(object) {
  if (reactiveMap.has(object)) {
    return reactiveMap.get(object)
  }
  const proxy = new Proxy(object, {
    // 处理器对象，定义捕获器
    get(target, key) {
      track(target, key)
      return typeof target[key] === 'object' ? reactive(target[key]) : Reflect.get(...arguments)
    },
    set(target, key) {
      trigger(target, key)
      Reflect.set(...arguments) // 等同于arguments[0][arguments[1]] = arguments[2]
      // 在一个对象上面设置一个属性
      // target 设置属性的目标对象
      // propertyKey 设置属性的名称
      // value 设置的值
      // receiver 如果遇到setter,receiver则为setter调用时候的this值
      // Reflect.set(target, propertyKey, value, receiver)
    },
  })
  // 加入缓存值
  reactiveMap.set(object, proxy)
  return proxy
}

/**
 * 随着依赖变化而执行的函数
 * @param {Function} fn
 */
function effect(fn) {
  try {
    effectStack.push(fn)
    // 执行fn函数,进行依赖解析
    return fn()
  } finally {
    effectStack.pop()
  }
}

/**
 * 计算属性,依赖项发生变化的时候执行
 * @param {Function} fn
 */
function computed(fn) {
  return {
    get value() {
      return effect(fn)
    },
  }
}

/**
 * track 数据追踪器
 * @param {*} target
 * @param {*} key
 */
function track(target, key) {
  // console.log('track', target, key)
  // let depMapData = new Map() // 第一层数据
  // let depSetData = new Set() // 第二层数据
  // let depMap = targetMap.get(target)
  // if (!depMap) {
  //   targetMap.set(target, depMapData)
  // }
  // let dep = depMapData.get(key)
  // if (!dep) {
  //   targetMap.get(target).set(key, depSetData)
  // }
  // console.log('targetMap', targetMap)
  // // 获取最后一个effect,也就是当前正在被解析的effect
  // const activeEffect = effectStack[effectStack.length - 1]
  // activeEffect && depSetData.add(activeEffect)
  // console.log('track', target, key)
  // 初始化依赖Map
  const activeEffect = effectStack[effectStack.length - 1]
  // 初始化-依赖收集
  if (activeEffect) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      depsMap = new Map()
      targetMap.set(target, depsMap)
    }

    // 第二层依赖使用Set存放key对应的effect
    let dep = depsMap.get(key)
    if (!dep) {
      dep = new Set()
      targetMap.get(target).set(key, dep)
    }
    // 取当前栈中的effect存入第二层依赖中
    dep.add(activeEffect)
    // 相当于如下写法 targetMap.get(target).get(key).add(activeEffect)
  }
}

/**
 * 依赖收集触发器
 */
function trigger(target, key) {
  const depMap = targetMap.get(target)
  // 开始执行effect方法
  if (depMap) {
    const effects = depMap.get(key)
    effects &&
      effects.forEach((run) => {
        run()
      })
  }
}
