/*
 * @Author: your name
 * @Date: 2020-05-07 20:42:53
 * @LastEditTime: 2020-05-12 20:50:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /code-fragment/http/server.js
 */
const fs = require('fs')
const path = require('path')
const http = require('http')

http
  .createServer(function (req, resp) {
    console.log(11111111, req.url)
    if (req.url == '/') {
      const html = fs.readFileSync('index.html', 'utf-8')
      resp.writeHead(200, {
        'Content-Type': 'text/html',
      })
      resp.end(html)
    }
    if (req.url == '/script.js') {
      resp.writeHead(200, {
        'Content-Type': 'text/javascript',
        'Cache-Control': 'max-age=200', // 设置缓存时间
      })
      resp.end("console.log('脚本文件')")
    }
  })
  .listen(8886)
