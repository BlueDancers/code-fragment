/*
 * @Author: your name
 * @Date: 2020-04-28 19:56:06
 * @LastEditTime: 2020-04-28 20:04:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /code-fragment/bundler/index.js
 */
;(function (graph) {
  function require(module) {
    function localRequire(relativePath) {
      return require(graph[module].dependencies[relativePath])
    }
    var exports = {}
    ;(function (require, exports, code) {
      eval(code)
      // exports通过打包代码之后运行填入相关属性,以便于下次后面的代码继续使用
    })(localRequire, exports, graph[module].code)

    return exports
  }
  require('./src/index.js')
})({
  './src/index.js': {
    dependencies: { './message.js': './src/message.js' },
    code:
      '"use strict";\n\nvar _message = _interopRequireDefault(require("./message.js"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }\n\nconsole.log(_message["default"]);',
  },
  './src/message.js': {
    dependencies: { './work.js': './src/work.js' },
    code:
      '"use strict";\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports["default"] = void 0;\n\nvar _work = require("./work.js");\n\nvar _default = "say ".concat(_work.word);\n\nexports["default"] = _default;',
  },
  './src/work.js': {
    dependencies: {},
    code:
      '"use strict";\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports.word = void 0;\nvar word = \'hello\';\nexports.word = word;',
  },
})
