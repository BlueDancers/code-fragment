/*
 * @Author: your name
 * @Date: 2020-05-07 20:42:53
 * @LastEditTime: 2020-05-22 15:01:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /code-fragment/http/server.js
 */
const fs = require('fs')
const http = require('http')

http
  .createServer(function (req, resp) {
    if (req.url == '/') {
      const html = fs.readFileSync('nginx-cache/index.html', 'utf-8')
      resp.writeHead(200, {
        'Content-Type': 'text/html',
      })
      resp.end(html)
    } else if (req.url == '/data') {
      resp.writeHead(200, {
        // 'Cache-Control': 'max-age=2, s-maxage=20' // max-age是浏览器用的,s-maxage专门给http服务器用的,如果没设置s-maxage http服务器会使用max-age
        'Cache-Control': 's-maxage=200',
        Vary: 'X-Test-Cache', // vary可以设置特定缓存头,只有值一样.http服务器才会返回缓存数据
      })
      setTimeout(() => {
        resp.end('success')
      }, 1000)
    }
  })
  .listen(8886)
