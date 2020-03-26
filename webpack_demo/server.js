/*
 * @Author: your name
 * @Date: 2020-03-25 18:42:40
 * @LastEditTime: 2020-03-25 18:56:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /code-fragment/webpack_demo/server.js
 */
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const config = require('./webpack.config')
const complier = webpack(config)

const app = express()
app.use(
  webpackDevMiddleware(complier, {
    publicPath: config.output.publicPath
  })
)
app.listen(3000, () => {
  console.log('express running')
})
