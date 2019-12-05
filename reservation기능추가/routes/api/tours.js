const express = require('express');
const Tour = require('../../models/tour');
const catchErrors = require('../../lib/async-error');

const router = express.Router();

// Index
router.get('/', catchErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const tours = await Tour.paginate({}, {
    sort: {createdAt: -1}, 
    populate: 'author',
    page: page, limit: limit
  });
  res.json({tours: tours.docs, page: tours.page, pages: tours.pages});   
}));

// Read
router.get('/:id', catchErrors(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('author');
  res.json(tour);
}));

// Create
router.post('', catchErrors(async (req, res, next) => {
  var tour = new Tour({
    title: req.body.title,
    author: req.user._id,
    content: req.body.content,
    tags: req.body.tags.map(e => e.trim()),
  });
  await tour.save();
  res.json(tour)
}));

// Put
router.put('/:id', catchErrors(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next({status: 404, msg: 'Not exist tour'});
  }
  if (tour.author && tour.author._id != req.user._id) {
    return next({status: 403, msg: 'Cannot update'});
  }
  tour.title = req.body.title;
  tour.content = req.body.content;
  tour.tags = req.body.tags;
  await tour.save();
  res.json(tour);
}));

// Delete
router.delete('/:id', catchErrors(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next({status: 404, msg: 'Not exist tour'});
  }
  if (tour.author && tour.author._id != req.user._id) {
    return next({status: 403, msg: 'Cannot update'});
  }
  await Tour.findOneAndRemove({_id: req.params.id});
  res.json({msg: 'deleted'});
}));


module.exports = router;