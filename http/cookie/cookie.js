/*
 * @Author: your name
 * @Date: 2020-05-07 20:42:53
 * @LastEditTime: 2020-05-21 19:30:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /code-fragment/http/server.js
 */
const fs = require('fs')
const path = require('path')
const http = require('http')

http
  .createServer(function (req, resp) {
    const html = fs.readFileSync('cookie/index.html', 'utf-8')
    resp.writeHead(200, {
      'Content-Type': 'text/html',
      // max-age 过期时间 HttpOnly 设置之后js将无法获取到该cookie
      // domain 可以指定域进行设置cookie, 例如设置主域名可以访问到 子域名都可以共享cookie
      'Set-cookie': [
        'id=123;max-age=10',
        'abc=15; HttpOnly',
        'id=1111;domain=test.com',
      ],
    })
    resp.end(html)
  })
  .listen(8886)
