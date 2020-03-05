const Router = require('koa-router');

const books = new Router();
const booksCtrl = require('./books.controller');

// step1. 여러 메소드 사용하기 
// const handler = (ctx, next) => {
//   ctx.body = `${ctx.request.method} ${ctx.request.path}`
// }
// books.get('/', handler);
// books.post('/', handler);
// books.delete('/', handler);
// books.put('/', handler);
// books.patch('/', handler);

// step2. 컨트롤러 사용
books.get('/', booksCtrl.list);
books.get('/:id', booksCtrl.get);
books.post('/', booksCtrl.create);
books.delete('/:id', booksCtrl.delete);
books.put('/:id', booksCtrl.replace); // 값 통째로 교체, 없으면 생성
books.patch('/:id', booksCtrl.update); // 특정 값만 업데이트

module.exports = books;