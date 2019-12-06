const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

var schema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },//몽구스에서 조인을 할 수 있게?
  title: {type: String, trim: true, required: true},
  numpeople: {type: String, trim: true, required: true},
  start: {type: Date, trim: true, required: true},
  end: {type: Date, trim: true},
  createdAt: {type: Date, default: Date.now},
  rev_name: {type: String, trim: true, required: true},
  phone_no: {type: String, trim: true, required: true},
  price: {type: Number, trim: true, required: true}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
schema.plugin(mongoosePaginate);
var Reservation = mongoose.model('Reservation', schema);

module.exports = Reservation;
