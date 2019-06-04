import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import router from './routers/router';

const app = new Koa();

app.use(bodyParser()); // 解析request的body
app.use(router.routes());
app.listen(9000);
console.log('app started at port 9000...');
