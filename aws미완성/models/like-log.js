const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var schema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  tour: { type: Schema.Types.ObjectId, ref: 'Tour' },
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
var LikeLog = mongoose.model('LikeLog', schema);

module.exports = LikeLog;

