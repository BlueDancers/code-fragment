const Router = require('koa-router')
const router = new Router()


router.get('/', (ctx) => {
  ctx.body = "路由测试"
})


router.post('/login', (ctx) => {
  console.log(ctx);  
  ctx.body = {
    data: '获取数据成功',
    status: 200
  }
})




module.exports = router
