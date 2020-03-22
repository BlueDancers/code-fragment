# Webpack4.x 学习记录（深入）

webpack是一个模块打包器，而不是代码翻译器

webpack不是非常智能，需要开发者来配置不同文件的打包方式

npx是一个指定当前环境的命令工具

就像package.json 里面的scripts脚本里面的环境



一个最基本的配置

```javascript
const path = require('path')

module.exports = {
  entry: './src/index.js', // 打包入口文件
  output: {
    filename: 'bundle.js', // 打包输出文件
    path: path.resolve(__dirname, 'bundle') // 打包路径
  }
}
```



打包命令相关

```javascript
vkcyan-MBP:webpack_demo vkcyan$ npm run bundle

> webpack_demo@1.0.0 bundle /Users/vkcyan/Desktop/github/code-fragment/webpack_demo
> webpack

Hash: 98e16d7ca7b6dcac83b2
Version: webpack 4.42.0
Time: 51ms
Built at: 2020-03-22 21:17:15
    Asset      Size  Chunks             Chunk Names
bundle.js  4.02 KiB    main  [emitted]  main // main的原因是默认打包名字就是main
Entrypoint main = bundle.js
[./src/index.js] 244 bytes {main} [built]
```



打包模式配置  production 为压缩代码  development为未压缩代码

```javascript
module.exports = {
  // mode: 'production', // 线上模式
  mode: 'development', // 开发模式
  entry: {
    main: './src/index.js' // main就是打包入口
  }
 	......
}
```



