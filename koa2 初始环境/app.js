const Koa = require('koa2')
const response = require('koa-bodyparser')
const router = require('./src/routes/routers')

const app = new Koa()
app.use(response())
app.listen(3000, () => {
  console.log('[koa] is start');
})

app.use(router.routes())

