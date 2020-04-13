/*
 * @Author: your name
 * @Date: 2020-04-13 18:28:21
 * @LastEditTime: 2020-04-13 20:49:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /code-fragment/webpack_demo/build/webpack.dll.js
 */
const webpack = require('webpack')
const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    lodash: ['lodash'],
  },
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, '../dll'),
    library: '[name]', // 必须暴露出去,才可以被引用
  },
  plugins: [
    // 库映射关系文件,
    new webpack.DllPlugin({
      name: '[name]',
      path: path.resolve(__dirname, '../dll/[name].manifest.json'),
    }),
  ],
}
