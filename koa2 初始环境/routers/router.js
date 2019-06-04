import Router from 'koa-router';

const router = new Router();

router.get('/login', async ctx => {
  // 通过controllers 来获取数据库信息 router 层仅仅负责连接数据API与路由
  let num = await asyncRunTime();
  console.log(num);
  ctx.body = num;
});

function asyncRunTime() {
  return new Promise((resolve, reject) => {
    return setTimeout(() => {
      resolve(11111111);
    }, 1000);
  });
}

export default router;
