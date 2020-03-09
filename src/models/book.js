const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Types: { ObjectId } } = require('mongoose');
const Author = require('models/author');
const AuthorSchema = mongoose.model('Author').schema;

const Book = new Schema({
  title: String,
  authors: [AuthorSchema], // 위에서 만든 Author 스키마를 가진 객체들의 배열형태로 설정했습니다.
  publishedDate: Date,
  price: Number,
  tags: [String],
  createdAt: { // 기본값을 설정할땐 이렇게 객체로 설정해줍니다
    type: Date,
    default: Date.now // 기본값은 현재 날짜로 지정합니다.
  }
});

// 스키마를 모델로 변환하여, 내보내기 합니다.
module.exports = mongoose.model('Book', Book);
// books 로 생성되는 기본 값을 따르고 싶지 않으면 아래처럼
// module.exports = mongoose.model('Book', Book, 'custom_book_collection');