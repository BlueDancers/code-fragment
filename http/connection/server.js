/*
 * @Author: your name
 * @Date: 2020-05-07 20:42:53
 * @LastEditTime: 2020-05-22 15:01:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /code-fragment/http/server.js
 */
const fs = require('fs')
const path = require('path')
const http = require('http')

http
  .createServer(function (req, resp) {
    const html = fs.readFileSync('connection/index.html', 'utf-8')
    const img = fs.readFileSync('connection/test.png')

    if (req.url == '/') {
      resp.writeHead(200, {
        'Content-Type': 'text/html',
        Connection: 'close',
      })
      resp.end(html)
    } else {
      resp.writeHead(200, {
        'Content-Type': 'image/png',
        Connection: 'close',
      })
      // Connection: keep-alive
      resp.end(img)
    }
  })
  .listen(8886)
