/*
 * @Author: your name
 * @Date: 2020-04-03 16:28:44
 * @LastEditTime: 2020-04-03 18:44:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /code-fragment/webpack_demo/webpack.config.js
 */
const path = require('path')
module.exports = {
  entry: '../src/index',
  externals: ['lodash'],
  // 如果我们想引用一个库，但是又不想让webpack打包，并且又不影响我们在程序中以CMD、AMD或者window/global全局等方式进行使用，那就可以通过配置externals。这个功能主要是用在创建一个库的时候用
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'library', // 打包名
    library: 'library', // 注入全局变量
    libraryTarget: 'umd' // 全平台打包方式
  }
}
