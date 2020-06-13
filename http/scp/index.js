const fs = require('fs')
const http = require('http')

http
  .createServer(function (req, resp) {
    if (req.url == '/') {
      const html = fs.readFileSync('scp/index.html', 'utf-8')
      resp.writeHead(200, {
        'Content-Type': 'text/html',
        // 'Content-Security-Policy': 'default-src http: https:', // 指定脚本文件只能通过链接的方式进行引用
        // 'Content-Security-Policy': "default-src 'self' https://cdn.bootcdn.net", // 禁止外部js脚本加载 后续可以追加最佳白名单
        // 'Content-Security-Policy': "default-src 'self' form-action 'self'", // 禁止form表单的提交 后续可最佳报名单
        // 'Content-Security-Policy': "script-src 'self'; report-uri /report", // 只禁止script标签 report-uri是遇到未遵循scp安全策略的就会向这个uri进行请求的发送
        // 'Content-Security-Policy-Report-Only':
        //   "script-src 'self'; report-uri /report",  // 当请求头为Report-Only的时候,不遵循scp原则的链接不仅会爆出警告,还会加载出来
        // 还可以通过meta头的形式实现
      })
      resp.end(html)
    } else {
      resp.writeHead(200, {
        'Content-Type': 'application/javascript',
      })
      resp.end('console.log("reload script")')
    }
  })
  .listen(8886)
