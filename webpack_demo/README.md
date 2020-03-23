# Webpack4.x 学习记录（深入）

webpack是一个模块打包器，而不是代码翻译器

webpack不是非常智能，需要开发者来配置不同文件的打包方式

npx是一个指定当前环境的命令工具

就像package.json 里面的scripts脚本里面的环境



## 基础配置



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



## loader

webpack是一个不是那么智能模块打包器，js是一个模块，图片是模块，css也是模块，对于不同的模块都需要不同的loader来进行对模块的处理

> webpack打包后会修改掉文件名，同时代码里面也会修改掉文件名称

```javascript
  module: {
    // 对不同模块进行打包
    rules: [
      {
        test: /\.png$/,
        use: {
          loader: 'file-loader'
        }
      }
    ]
  },
```

webpack默认支持打包js文件，但是如果碰到了`.js`文件之外的文件的的时候，webpack就无法进行打包了，所以需要借助其他工具才可以进行打包，这里我们就用到了module，module就是帮助我们处理模块的识别，识别loader就会进行模块处理，处理完成后将生产的文件名会返回到打包的页面中



### url-loader

> 完全替代file-loader的loader，支持配置阈值一下的文件直接打包成为base64

```javascript
 module: {
    // 对不同模块进行打包
    rules: [
      {
        test: /\.(png|jpg|gif)$/, // 指定打包文件后缀
        use: {
          loader: 'url-loader',
          options: {
            // placeholder 为占位文字
            name: '[name]_[hash].[ext]', // 文件名字不变 name 文件名 ext 文件拓展名 hash 为哈希值
            outputPath: 'images/', // 打包到指定目录下面
            limit: 2048 // 打包成为base64的阈值 2048以上就会打包成为文件 与file-loader效果相同
          }
        }
      }
    ]
  },
```

