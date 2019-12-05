const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

var schema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  tour: { type: Schema.Types.ObjectId, ref: 'Tour' },
  content: {type: String, trim: true, required: true},
  numLikes: {type: Number, default: 0},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
schema.plugin(mongoosePaginate);
var Question = mongoose.model('Question', schema);

module.exports = Question;
