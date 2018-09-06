function Compile (el, vm) {
  this.$vm = vm
  this.$el = this.isElementNode(el) ? el : document.querySelector(el) //querySelector() 方法返回文档中匹配指定 CSS 选择器的一个元素。
  if (this.$el) { // 解析el的节点
    this.$fragment = this.nodesFrgament(this.$el)
    this.init() // 递归解析
    this.$el.appendChild(this.$fragment);
  }
}

Compile.prototype = {
  nodesFrgament: function (el) {

    var virtualChlid = document.createDocumentFragment() // 方法创建了一虚拟的节点对象， 节点对象包含所有属性和方法。
    var child
    while (child = el.firstChild){  // el.firstChild
      virtualChlid.appendChild(child) // 为什么 el里面每次获取后就少一个??????? 拷贝这里怎么就实现了??
    }

    return virtualChlid; // 所有的dom元素都存储在虚拟节点里面
  },

  init () {
    this.compileElement(this.$fragment)
  },

  compileElement: function (el) {
    var childNodes = el.childNodes
    var me = this;
    
    [].slice.call(childNodes).forEach(function (node) { // 每个node节点
      var text = node.textContent //获取文本,不存在就为空
      var reg = /\{\{(.*)\}\}/
      
      if (me.isElementNode(node)) { // 判断type类型是1 就属性节点
        me.compile(node)

      } else if (me.isTextNode(node) && reg.test(text)) { //匹配 {{}}

        me.compileText(node, RegExp.$1) // 获取正则匹配的第一个字符串 {{ text }}的text
      }

      if (node.childNodes && node.childNodes.length) {
        me.compileElement(node)
      }
    });
  },
  compile: function (node) { //解析属性节点
    var nodeAttrs = node.attributes;
    var me = this;
    [].slice.call(nodeAttrs).forEach(function (attr) {  // 解析节点上的名称
      var attrName = attr.name
      if(me.isDirective(attrName)){
        var exp = attr.value // 获取v-xxxxx的data名
        var dir = attrName.substring(2) // 获取v-xxx 的xxxx 例如v-model 的model
        
        if (me.isEventDirective(dir)) {  //解析指令
          //事件指令
          compileUtil.eventHandler(node, me.$vm, exp, dir)
        } else {
          //普通指令
          compileUtil[dir] && compileUtil[dir](node, me.$vm, exp)
          // compileUtil[model] compileUtil[html]
        }
        
        node.removeAttribute(attrName);
      }

    })
  },
  compileText: function (node, exp) {
    compileUtil.text(node, this.$vm, exp)
  },
  isDirective: function (attr) {  //判断v-xx指令
    return attr.indexOf('v-') === 0
  },
  isEventDirective: function (dir) { // 判断v-on
    return dir.indexOf('on') === 0
  },
  isTextNode: function (node) {  //判断文本节点
    return node.nodeType == 3;
  },
  isElementNode: function (node) { // 判断属性节点
    return node.nodeType === 1
  },
}

var compileUtil = {
  bind: function (node, vm, exp, dir) {
    var updaterFn = updater[dir + 'Updater']
    updaterFn && updaterFn(node, this._getVMVal(vm, exp)) //关键代码 将匹配出来的键转换成为值
    //所有的更新都走build进行分发,所以在build里面进行订阅
    //此操作会在对应的属性消息订阅器中添加了该订阅者watcher
    new Watcher(vm, exp, function (value, oldValue) {
      updaterFn && updaterFn(node, value, oldValue)
    })
  },
  text: function (node, vm, exp) {
    this.bind(node, vm, exp, 'text')
  },
  model: function (node, vm, exp) {
    this.bind(node, vm, exp, 'model')
    var me = this
    var val = this._getVMVal(vm, exp)
    node.addEventListener('input', function (e) {
      var newValue = e.target.value
      if (val === newValue) {
        return;
      }
      me._setVMVal(vm, exp, newValue)
    })
    
  },
  html: function (node, vm, exp) {
    this.bind(node, vm, exp, 'html')
  },
  eventHandler: function (node, vm, exp, dir){ // 解析的dom 全局vm对象 exp要执行的方法 dir事件名
    var eventType = dir.split(':')[1]
    var fn = vm.$options.methods && vm.$options.methods[exp] // 感觉vm.$options.methods[exp]就行了
    
      if(eventType && fn) {
        node.addEventListener(eventType,
        fn.bind(vm), // 将vm的this交给fn 方法内部的this需要指向vm
        false
      )
    }
  },
  _getVMVal: function (vm, exp) {
    //return vm[exp] // 对data的键进行解析

    var val = vm
    exp = exp.split('.') // 因为data可能不止一层
    exp.forEach(function (k) {  //这里有点蒙圈,应该是取最后一个
      val = val[k]  //这里获取了vm的属性
    })
    return val
  },
  _setVMVal: function (vm, exp, newValue) {  // 更新mvvm的vm上面的data,触发set事件
    var val = vm
    exp = exp.split('.')
    exp.forEach(function (key, index) {
      // 如果不是最后一个key 则更新val值 直到最后一个 更新其数据
      if (index < exp.length - 1){
        val = val[key]
      } else {
        val[key] = newValue
      }
    })
  }

}

var updater = {  // 将指令更新为data数据
  textUpdater: function (node, value) {
    node.textContent = typeof value === 'undefined' ? '' : value //更新text
  },
  modelUpdater: function (node, value) {
    node.value = typeof value === 'undefined' ? '' : value // 填入到表单
  },
  htmlUpdater: function (node, value) {
    node.innerHTML = typeof value === 'undefined' ? '' : value
  }
}
