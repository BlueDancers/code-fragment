let koa = require('koa')
var mongoose = require('mongoose')
let User = require('./user')
var bodyParser = require('koa-bodyparser');
let app = new koa();
app.use(bodyParser());
app.use(async (ctx) => {
  if (ctx.url === '/' && ctx.method == 'GET') {
    //显示表单页面
    let html = `
      <h1>this is POST</h1>
       <form action="http://localhost/" method="POST">
      <p>姓名: <input type="text" name="name"></p>
      <p>年龄: <input type="text" name="age"></p>
      <p>电话: <input type="text" name="call"></p>
      <p>邮箱: <input type="text" name="email"></p>
      <input type="submit" value="提交">
    </form>
    `
    ctx.body = html
  } else if (ctx.url === '/' && ctx.method == 'POST') {
    let postData = ctx.request.body;
    ctx.body = postData;
    console.log(postData);
    User.create({
      username: postData.name,
      password: postData.age,
      call: postData.call,
      email: postData.email
    },(err) => {
      if(err) return
      console.log('插入成功');
    })
  } else {
    ctx.body = '<h1>404</h1>'
    let data = '';

  }
})
app.listen(80,()=>{
  console.log('[koa] is start');
})


