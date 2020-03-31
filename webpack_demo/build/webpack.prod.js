/*
 * @Author: vkcyan
 * @Date: 2020-03-22 11:42:40
 * @LastEditTime: 2020-03-31 18:28:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /code-fragment/webpack_demo/webpack.config.js
 */

const merge = require('webpack-merge')
const commonConfig = require('./webpack.common')
const prodConfig = {
  mode: 'production', // 线上模式
  devtool: 'none',
  optimization: {
    // 启用摇树优化
    usedExports: true
  }
}
module.exports = merge(commonConfig, prodConfig)
