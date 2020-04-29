/*
 * @Author: your name
 * @Date: 2020-04-22 19:43:57
 * @LastEditTime: 2020-04-29 10:11:59
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
  // 循环所有依赖文件,处理依赖关系
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
  // 处理数据结构,以便于后面进行代码分析
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
      // 带入require函数,帮助父级代码递归找到引用的模块代码
      function require(module) {
        function localRequire(relativePath) {
          // 进行递归所有引用文件
          return require(graph[module].dependencies[relativePath])
        }
        var exports = {};
        (function(require, exports, code){
          eval(code)
          // exports会在打包代码中进行填充,将数据逐步填充到最父级
        })(localRequire, exports, graph[module].code);
        return exports
      }
      require('${entry}')
    })(${graph})
  `
}

const code = generateCode('./src/index.js')
console.log(code)
