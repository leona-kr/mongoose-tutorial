const Joi = require('joi');
const { Types: { ObjectId } } = require('mongoose');

const Book = require('models/book');

exports.get = async (ctx) => {
  const { id } = ctx.params;

  let book;

  try {
    book = await Book.findById(id).exec();
  } catch (e) {
    if(e.name === 'CastError'){
      ctx.status = 400; // Bad requeset
      return;
    }
    return ctx.throw(500, e);
  }

  if(!book){
    // 존재하지 않으면
    ctx.status = 404;
    ctx.body = { errorCode: "404", message: 'book not found' };
    return;
  }

  ctx.body = book;
};

exports.list = async (ctx) => {
  // 변수를 미리 선언
  let books;

  try {
    // 데이터를 조회한다
    // .exec() 를 뒤에 붙여줘야 실제로 데이터베이스에 요청이 된다
    // 반환값은 Promise 이므로 await를 사용할 수 있다.
    books = await Book.find()
          .sort({_id: -1})  // _id 역순으로 정렬
          .limit(3) // 3개만 보여지도록 정렬
          .exec();  // 데이터를 서버에 요청
  } catch (e) {
    return ctx.throw(500, e);
  }

  ctx.body = books;
};

exports.create = async (ctx) => {
  const { body } = ctx.request;

  const { 
    title,
    authors,
    publishedDate,
    price,
    tags
  } = ctx.request.body;

  // Book 인스턴스를 생성
  const book = new Book({
    title,
    authors,
    publishedDate,
    price,
    tags
  });

  // 만들어진 Book 인스턴스를 이렇게 수정할 수도 있음
  // book.title = title;

  // .save() 함수를 실행하면 이 때 데이터베이스에 실제로 데이터를 입력
  // Promise 를 반환한다
  try {
    await book.save();
  } catch(e) {
    // HTTP 상태 500 과 Internal Error 라는 메시지를 반환하고
    // 에러를 기록한다.
    return ctx.throw(500, e);
  }

  // 저장한 결과를 반환한다
  ctx.body = book;
};

exports.delete = async (ctx) => {
  // .remove : 특정 조건을 만족하는 데이터를 모두 지움
  // .findByIdAndRemove : id를 찾아서 지움
  // .findOneAndRemove : 특정 조건을 만족하는 데이터 하나를 지움

  const { id } = ctx.params;

  try {
    await Book.findByIdAndRemove(id).exec();
  } catch (e){
    if(e === 'CastError'){
      ctx.status = 400;
      return;
    }
  }

  ctx.status = 204; // no content
};

exports.replace = async (ctx) => {
  const { body } = ctx.request;
  const { id } = ctx.params; // URL 파라미터에서 id 값을 읽어옵니다.

  if(!ObjectId.isValid(id)) {
    ctx.status = 400; // Bad Request
    return;
  }

  // 먼저, 검증 할 스키마를 준비해야합니다.
  const schema = Joi.object().keys({ // 객체의 field 를 검증합니다.
    // 뒤에 required() 를 붙여주면 필수 항목이라는 의미입니다
    title: Joi.string().required(),
    authors: Joi.array().items(Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().email().required() // 이런식으로 이메일도 손쉽게 검증가능합니다
    })),
    publishedDate: Joi.date().required(),
    price: Joi.number().required(),
    tags: Joi.array().items((Joi.string()).required())
  });

  // 그 다음엔, validate 를 통하여 검증을 합니다.
  const result = Joi.validate(body, schema); // 첫번째 파라미터는 검증할 객체이고, 두번째는 스키마입니다.

  // 스키마가 잘못됐다면
  if(result.error) {
    ctx.status = 400; // Bad Request
    ctx.body = result.error;
    return;
  }

  let book;

  try {
    // 아이디로 찾아서 업데이트
    // 파라미터는 (아이디, 변경 할 값, 설정) 순
    book = await Book.findByIdAndUpdate(id, body, {
      upsert: true, // true 일 경우 데이터가 존재하지 않으면 새로 만들어 준다
      new : true // 이 값을 넣어줘야 반환하는 값이 업데이트된 데이터, 없으면 ctx.body의 값이 request.body 값
    });
  } catch(e) {
    return ctx.throw(500, e);
  }

  ctx.body = book;
}

exports.update = async (ctx) => {
  const { body } = ctx.request;
  const { id } = ctx.params;

  if(!ObjectId.isValid(id)){
    ctx.status = 400; // Bad Request
    return;
  }

  let book;

  try {
    // 아이디로 찾아서 업데이트
    // 파라메터는 (아이디, 변경 할 값, 설정) 순
    book = await Book.findByIdAndUpdate(id, body, {
      // upsert 의 기본값은 false 입니다.
      new: true // 이 값을 넣어줘야 반환하는 값이 업데이트된 데이터, 없으면 ctx.body의 값이 request.body 값
    });
  } catch (e){
    return ctx.throw(500, e);
  }

  ctx.body = book;
};