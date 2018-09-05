class MVVM {
  constructor(options) {
    const {
      el,
      data,
      methods
    } = options
    this.methods = methods
    this.target = null
    this.observer(this, data)
    this.instruction(document.getElementById(el)) // 获取挂载点
  }

  // 数据监听器 拦截所有data数据 传给defineProperty用于数据劫持
  observer(root, data) {
    for (const key in data) {
      this.definition(root, key, data[key])
    }
  }

  // 将拦截的数据绑定到this上面
  definition(root, key, value) {
    // if (typeof value === 'object') { // 假如value是对象则接着递归
    //   return this.observer(value, value)
    // }
    let dispatcher = new Dispatcher() // 调度员

    Object.defineProperty(root, key, {
      set(newValue) {
        value = newValue
        dispatcher.notify(newValue)
      },
      get() {
        dispatcher.add(this.target)
        return value
      }
    })
  }

  //指令解析器
  instruction(dom) {
    const nodes = dom.childNodes; // 返回节点的子节点集合
    // console.log(nodes); //查看节点属性
    for (const node of nodes) { // 与for in相反 for of 获取迭代的value值
      if (node.nodeType === 1) { // 元素节点返回1
        const attrs = node.attributes //获取属性

        for (const attr of attrs) {
          if (attr.name === 'v-model') {
            let value = attr.value //获取v-model的值

            node.addEventListener('input', e => { // 键盘事件触发
              this[value] = e.target.value
            })
            this.target = new Watcher(node, 'input') // 储存到订阅者
            this[value] // get一下,将 this.target 给调度员
          }
          if (attr.name == "@click") {
            let value = attr.value // 获取点击事件名
            
            node.addEventListener('click',
              this.methods[value].bind(this)
            )
          }
        }
      }

      if (node.nodeType === 3) { // 文本节点返回3
        let reg = /\{\{(.*)\}\}/; //匹配 {{  }}
        let match = node.nodeValue.match(reg)
        if (match) { // 匹配都就获取{{}}里面的变量
          const value = match[1].trim()
          this.target = new Watcher(node, 'text')
          this[value] = this[value] // get set更新一下数据
        }
      }
    }

  }
}

//调度员 > 调度订阅发布
class Dispatcher {
  constructor() {
    this.watchers = []
  }
  add(watcher) {
    this.watchers.push(watcher) // 将指令解析器解析的数据节点的订阅者存储进来,便于订阅
  }
  notify(newValue) {
    this.watchers.map(watcher => watcher.update(newValue))
    // 有数据发生,也就是触发set事件,notify事件就会将新的data交给订阅者,订阅者负责更新
  }
}

//订阅发布者 MVVM核心
class Watcher {
  constructor(node, type) {
    this.node = node
    this.type = type
  }
  update(value) {
    if (this.type === 'input') {
      this.node.value = value // 更新的数据通过订阅者发布到dom
    }
    if (this.type === 'text') {
      this.node.nodeValue = value
    }
  }
}