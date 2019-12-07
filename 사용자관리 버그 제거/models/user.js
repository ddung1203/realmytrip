const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Schema = mongoose.Schema;

var schema = new Schema({
  name: {type: String, required: true, trim: true},
  email: {type: String, required: true, index: true, unique: true, trim: true},
  password: {type: String},
  facebook: {id: String, token: String, photo: String},//이메일은 worst-case 안넘어올 수 있기에 email은 넣지 않음!
  createdAt: {type: Date, default: Date.now},
  grade: {type: String, trim: true}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

schema.methods.generateHash = function(password) {//schema.methods에 저러한 함수를 넣으면 자바로 치면 instance methods로 됨?
  return bcrypt.hash(password, 10); // return Promise//10이 salt로 password dictionary로 못하게 
};//password 암호화하는거, hash로 암호화

schema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password); // return Promise
};//this가 해슁된 값, 같으면 return

var User = mongoose.model('User', schema);

module.exports = User;
