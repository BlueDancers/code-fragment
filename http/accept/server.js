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
const zlib = require('zlib')

http
  .createServer(function (req, resp) {
    const html = fs.readFileSync('accept/index.html')
    resp.writeHead(200, {
      'Content-Type': 'text/html',
      'Accept-Encoding': 'gzip',
    })

    resp.end(zlib.gunzipSync(html))
  })
  .listen(8886)

  // 有问题