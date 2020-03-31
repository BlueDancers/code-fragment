/*
 * @Author: vkcyan
 * @Date: 2020-03-22 11:42:40
 * @LastEditTime: 2020-03-31 18:27:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /code-fragment/webpack_demo/webpack.config.js
 */

const webpack = require('webpack')
const merge = require('webpack-merge')
const commonConfig = require('./webpack.common')
const devConfig = {
  mode: 'development', // 开发模式
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: './bundle', // 指定监听文件,一般情况下不需要写
    hot: true // 是否开启热更新
    // hotOnly: true // 启用热模块替换,而不会在构建失败的情况下进行页面刷新作为后备。
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // 可以做到模块化替换 配合热更新使用
    new webpack.NamedModulesPlugin() // 提示热更新的文件
  ]
}

module.exports = merge(commonConfig, devConfig)
