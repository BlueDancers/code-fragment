# Koa2初始环境

koa2这个也算是最喜欢的一个node框架了,使用的比较多.总是搭建初始环境,浪费时间,这里存储一个初始化完成的koa2环境

config : 各种配置信息

controllers : 控制层 被路由请求 请求 models

models : 数据操作层 被控制层 请求 请求 schema

routes : 路由层 被用户 请求Controller

schema : 数据模型层 被models层 请求 请求 数据库

大致是这样的

![](D:\vkcyan\github\Small-code\koa2 初始环境\one.png)





还有一些可能会用到的

```
npm install jsonwebtoken 
npm install md5
npm install mongoose
npm install pm2
```

pm2可能用到的命令

```
"start": "pm2 start app.js --watch",
"c": "pm2 logs app [--lines 3000]",
"stop": "pm2 stop all",
"delete": "pm2 delete 0"
```

