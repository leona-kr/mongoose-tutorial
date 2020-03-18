const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Types: { ObjectId } } = require('mongoose');
const Author = require('models/author');
const AuthorSchema = mongoose.model('Author').schema;

const Book = new Schema({
  title: {
    type: String,
    required: true
  },
  // author 스키마 그대로 book 인스턴스 요소에 담겨진다
  authors: [AuthorSchema],
  // author의 objectId 값만 book 인스턴스 요소에 담겨진다
  // authors: [{
  //   type: ObjectId,
  //   ref: Author
  // }],
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