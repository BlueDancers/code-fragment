/*
 * @Author: your name
 * @Date: 2020-04-22 19:43:57
 * @LastEditTime: 2020-04-28 19:56:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /code-fragment/bundler/bundler.js
 */
const path = require('path')
const fs = require('fs')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')

const moduleAnalyser = (filename) => {
  const content = fs.readFileSync(filename, 'utf-8') //读取文件内容
  const dependencies = {} // 文件依赖关系存储
  const ast = parser.parse(content, {
    // 语法分析为ast语法
    sourceType: 'module',
  })
  // 通过ast抽象语法书
  traverse(ast, {
    // 分析依赖故乡里
    ImportDeclaration({ node }) {
      let dirname = path.dirname(filename)
      const newFile = './' + path.join(dirname, node.source.value)
      // 对依赖关系进行映射
      dependencies[node.source.value] = newFile
    },
  })
  // 将高级语法转化为es5语法
  let { code } = babel.transformFromAst(ast, null, {
    presets: ['@babel/preset-env'],
  })
  return {
    filename,
    dependencies,
    code,
  }
}

const makeDependenciesGraph = (entry) => {
  const entryModule = moduleAnalyser(entry)
  const graphArray = [entryModule]
  for (let i = 0; i < graphArray.length; i++) {
    const item = graphArray[i]
    const { dependencies } = item
    if (dependencies) {
      for (const key in dependencies) {
        graphArray.push(moduleAnalyser(dependencies[key]))
      }
    }
  }
  const graph = {}
  graphArray.map((item) => {
    graph[item.filename] = {
      dependencies: item.dependencies,
      code: item.code,
    }
  })
  return graph
}

const generateCode = (entry) => {
  const graph = JSON.stringify(makeDependenciesGraph(entry))
  return `
    (function (graph){
      // graph为全部的代码处理数据
      function require(module) {
        function localRequire(relativePath) {
          // 进行递归所有引用文件
          return require(graph[module].dependencies[relativePath])
        }
        var exports = {};
        (function(require, exports, code){
          eval(code)
        })(localRequire, exports, graph[module].code);
        return exports
      }
      require('${entry}')
    })(${graph})
  `
}

const code = generateCode('./src/index.js')
console.log(code)
