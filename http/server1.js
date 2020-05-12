/*
 * @Author: your name
 * @Date: 2020-05-07 20:42:53
 * @LastEditTime: 2020-05-12 20:25:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /code-fragment/http/server.js
 */
const fs = require('fs')
const path = require('path')
const http = require('http')

http
  .createServer(function (req, resp) {
    // 写入跨域头部信息
    resp.writeHead(200, {
      'Access-Control-Allow-Origin': '*', //'http://localhost:8886',
      'Access-Control-Allow-Headers': 'SESSION,x-text-token,Content-Type',
      'Access-Control-Allow-Methods': 'PUT',
    })
    resp.end('success')
  })
  .listen(8887)

console.log('被访问服务启动')
