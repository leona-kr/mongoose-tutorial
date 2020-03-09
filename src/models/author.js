const mongoose = require('mongoose');
const { Schema } = mongoose;

// Book 에서 사용할 서브다큐먼트의 스키마입니다.
const Author = new Schema({
  name: String,
  email: String
});

// 스키마를 모델로 변환하여, 내보내기 합니다.
module.exports = mongoose.model('Author', Author);
// books 로 생성되는 기본 값을 따르고 싶지 않으면 아래처럼
// module.exports = mongoose.model('Book', Book, 'custom_book_collection');