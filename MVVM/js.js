class Mvvm {
  constructor(options) {
    const {
      el,
      data,
      methods
    } = options;
    this.methods = methods;
    this.target = null;
    // 初始化dispatcher
    this.observe(this, data); //挂载数据
    // 初始化watcher
    this.compile(document.getElementById(el));
  }
  // 劫持所有的data属性
  observe(root, data) {
    for (const key in data) {
      this.defineReactive(root, key, data[key]);
    }
  }

  // 对data数据进行监听 ,同时 数据发生变化就会通知Dispatcher
  defineReactive(root, key, value) {
    if (typeof value == 'object') {
      return this.observe(value, value);
    }
    const dep = new Dispatcher();
    Object.defineProperty(root, key, {
      set(newValue) {
        if (value == newValue) return;
        value = newValue;
        // 发布
        dep.notify(newValue);    //数据发生变化了,通知调度员
      },
      get() {
        // 订阅
        dep.add(this.target);  //watcher()
        return value;
      }
    });
  }

  compile(dom) {
    const nodes = dom.childNodes;
    for (const node of nodes) {
      // 元素节点
      //如果节点是元素节点，则 nodeType 属性将返回 1。将有属性的元素阶段过滤下来
      if (node.nodeType == 1) {
        const attrs = node.attributes; //获取属性
        for (const attr of attrs) {
          if (attr.name == 'v-model') {
            const name = attr.value;   //获取data属性
            node.addEventListener('input', e => {  
              this[name] = e.target.value;  //不懂为什么这么写
            });
            console.log(node);
            
            this.target = new Watcher(node, 'input');
            this[name];
          }
          if (attr.name == '@click') {
            const name = attr.value;
            node.addEventListener('click', this.methods[name].bind(this));
          }
        }
      }
      // text节点
      if (node.nodeType == 3) {
        const reg = /\{\{(.*)\}\}/;
        const match = node.nodeValue.match(reg);
        if (match) {
          const name = match[1].trim();
          this.target = new Watcher(node, 'text');
          this[name];
        }
      }
    }
  }
}

class Dispatcher {
  constructor() {
    this.watchers = [];
  }
  add(watcher) {
    this.watchers.push(watcher);
    console.log(this.watchers);
    
  }
  notify(value) {
    this.watchers.forEach(watcher => watcher.update(value));
    console.log(this.watchers);
  }
}

class Watcher {          //
  constructor(node, type) {
    this.node = node; // 获取到节点
    this.type = type; // 获取到事件
  }
  update(value) {
    if (this.type == 'input') {
      this.node.value = value;
    }
    if (this.type == 'text') {
      this.node.nodeValue = value;
    }
  }
}