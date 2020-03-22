/*
 * @Author: vkcyan
 * @Date: 2020-03-22 11:42:40
 * @LastEditTime: 2020-03-22 21:17:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /code-fragment/webpack_demo/webpack.config.js
 */
const path = require('path')

module.exports = {
  // mode: 'production', // 线上模式
  mode: 'development', // 开发模式
  entry: {
    main: './src/index.js'
  }, // 打包入口文件
  output: {
    filename: 'bundle.js', // 打包输出文件
    path: path.resolve(__dirname, 'bundle') // 打包路径
  }
}
