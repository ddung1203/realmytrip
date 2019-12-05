const express = require('express');
const Reservation = require('../../models/reservation');
const catchErrors = require('../../lib/async-error');

const router = express.Router();

// Index
router.get('/', catchErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const reservations = await Reservation.paginate({}, {
    sort: {createdAt: -1}, 
    populate: 'author',
    page: page, limit: limit
  });
  res.json({reservations: reservations.docs, page: reservations.page, pages: reservations.pages});   
}));

// Read
router.get('/:id', catchErrors(async (req, res, next) => {
  const reservation = await Reservation.findById(req.params.id).populate('author');
  res.json(reservation);
}));

// Create
router.post('', catchErrors(async (req, res, next) => {
  var reservation = new Reservation({
    title: req.body.title,
    author: req.user._id,
    start: req.body.start,
    end: req.body.end,
    numpeople: req.body.numpeople
  });
  await reservation.save();
  res.json(reservation)
}));

// Put
router.put('/:id', catchErrors(async (req, res, next) => {
  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) {
    return next({status: 404, msg: 'Not exist reservation'});
  }
  if (reservation.author && reservation.author._id != req.user._id) {
    return next({status: 403, msg: 'Cannot update'});
  }
  reservation.title = req.body.title;
  reservation.start = req.body.start;
  reservation.end = req.body.end;
  reservation.numpeople = req.body.numpeople;
  await reservation.save();
  res.json(reservation);
}));

// Delete
router.delete('/:id', catchErrors(async (req, res, next) => {
  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) {
    return next({status: 404, msg: 'Not exist reservation'});
  }
  if (reservation.author && reservation.author._id != req.user._id) {
    return next({status: 403, msg: 'Cannot update'});
  }
  await Reservation.findOneAndRemove({_id: req.params.id});
  res.json({msg: 'deleted'});
}));


module.exports = router;