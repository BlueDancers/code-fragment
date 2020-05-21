/*
 * @Author: your name
 * @Date: 2020-05-07 20:42:53
 * @LastEditTime: 2020-05-21 18:48:43
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
      console.log(req.headers)
      const etag = req.headers['if-none-match']
      if (etag === '777') {
        resp.writeHead(304, {
          'Content-Type': 'text/javascript',
          'Cache-Control': 'max-age=2000000,no-cache', // 设置缓存时间
          'Last-Modified': '123', // 用作一个验证器来判断接收到的或者存储的资源是否彼此一致 Etag的备用方案
          // 客户端会携带 If-Modified-Since 返回到后台
          Etag: '777', // 用作一个验证器来判断接收到的或者存储的资源是否彼此一致
          // 客户端会携带 If-None-Match 返回到后台进行校验
        })
        // 增加后就自动304 下次都会读缓存
        resp.end()
      } else {
        resp.writeHead(200, {
          'Content-Type': 'text/javascript',
          'Cache-Control': 'max-age=2000000,no-cache', // 设置缓存时间
          'Last-Modified': '123', // 用作一个验证器来判断接收到的或者存储的资源是否彼此一致 Etag的备用方案
          // 客户端会携带 If-Modified-Since 返回到后台
          Etag: '777', // 用作一个验证器来判断接收到的或者存储的资源是否彼此一致
          // 客户端会携带 If-None-Match 返回到后台进行校验
        })
        resp.end("console.log('脚本文件')")
      }
    }
  })
  .listen(8886)
