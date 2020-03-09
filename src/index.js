require('dotenv').config(); // .env 파일에서 환경변수 불러오기

const port = process.env.PORT || 4000; // PORT 값이 설정되어있지 않다면 4000 을 사용합니다
const DBAddr = process.env.MONGO_URI;
const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();
const api = require('./api');

const mongoose = require('mongoose');
const bodyParser = require('koa-bodyparser');

mongoose.Promise = global.Promise; // node의 네이티브 Promise 사용
// mongodb 연결
mongoose.connect(DBAddr,{
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then((response)=>{
  console.log('Successfully connected to mongodb');
}).catch(e=>{
  console.error(e);
});

// step1. 미들웨어 어플리케이션 등록
// app.use( (ctx, next) => {
//   console.log(1);
//   const started = new Date();
//   next().then(()=>{// next()는 promise를 반환한다
//     console.log(new Date() - started + 'ms');
//   });
// });

// step2. async await
// app.use(async (ctx, next) => {
//   console.log(2);
//   const started = new Date();
//   await next();
//   console.log(new Date() - started + 'ms');
// });

// app.use(ctx => {
//   ctx.body = 'Hello koa';
// });

// step3. router
// router.get('/', (ctx, next) => {
//   ctx.body = 'home';
// })
// .get('/about', (ctx, next) => {
//   ctx.body = 'about';
// })
// .get('/about/:name', (ctx, next) => {
//   const { name } = ctx.params;
//   ctx.body = name +'\'s introdution.';
// })
// .get('/post', (ctx, next) => {
//   const { id } = ctx.request.query;
//   if(id){
//     ctx.body = 'Post id is #' + id;
//   } else {
//     ctx.body = 'There is no post id';
//   }
// });

app.use(bodyParser()); // 바디 파서 적용, 라우터 적용코드보다 상단에 있어야 함

router.use('/api', api.routes()); // api 라우트를 /api 경로 하위 라우터로 설정

app.use(router.routes())
  .use(router.allowedMethods());

app.listen(port, () => {
  console.log('server is listening to port ' + port);
});