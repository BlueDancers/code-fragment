const fs = require('fs')
const path = require('path')
const http = require('http')
const zlib = require('zlib')

http
  .createServer(function (req, resp) {
    if (req.url == '/') {
        // 302 表示短期跳转
        // 301 表示长期跳转 一旦浏览器读取到了301 就会进行常会时间缓存,到时候再改将不会有效果,除非缓存失效
      resp.writeHead(302, {
        Location: '/new',
      })
      resp.end()
    }
    if (req.url == '/new') {
      resp.writeHead(200, {
        'Content-Type': 'text/html',
      })
    }
    resp.end('<div>1111</div>')
  })
  .listen(8886)
