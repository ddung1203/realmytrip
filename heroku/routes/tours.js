const express = require('express');
const Tour = require('../models/tour');
const Review = require('../models/review'); 
const catchErrors = require('../lib/async-error');
const User = require('../models/user');
const router = express.Router();

const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');
const aws = require('aws-sdk');

// 동일한 코드가 users.js에도 있습니다. 이것은 나중에 수정합시다.
function needAuth(req, res, next) {
  if (req.isAuthenticated()) {//이 함수가 참이면 로그인된, 거짓이면 안된
    next();
  } else {
    req.flash('danger', 'Please signin first.');
    res.redirect('/signin');
  }
}

/* GET tours listing. */
router.get('/', catchErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;// ||아니면 10

  var query = {};
  const term = req.query.term;
  if (term) {
    query = {$or: [
      {title: {'$regex': term, '$options': 'i'}},
      {content: {'$regex': term, '$options': 'i'}},
      {tags: {'$regex': term, '$options': 'i'}}
    ]};//이런거 들어있는거 찾는거, i가 대소문자 안가린다
  }

  const tours = await Tour.paginate(query, {//무시하고 find라고 생각하셈
    sort: {createdAt: -1}, //최신글 먼저보이게
    populate: 'author', 
    page: page, limit: limit
  });
  res.render('tours/index', {tours: tours, term: term, query: req.query});
}));

router.get('/new', needAuth, (req, res, next) => {
  res.render('tours/new', {tour: {}});
});

router.get('/:id/edit', needAuth, catchErrors(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  res.render('tours/edit', {tour: tour});
}));

router.get('/:id', catchErrors(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('author');
  const reviews = await Review.find({tour: tour.id}).populate('author');
  tour.numReads++;    // TODO: 동일한 사람이 본 경우에 Read가 증가하지 않도록???

  await tour.save();
  res.render('tours/show', {tour: tour, reviews: reviews});
}));

router.post('/:id', catchErrors(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    req.flash('danger', 'Not exist tour');
    return res.redirect('back');
  }
  tour.title = req.body.title;
  tour.content = req.body.content;
  tour.author = req.body.author;
  tour.price = req.body.price;
  tour.tags = req.body.tags.split(" ").map(e => e.trim());

  await tour.save();
  req.flash('success', 'Successfully updated');
  res.redirect('/tours');
}));


router.delete('/:id', needAuth, catchErrors(async (req, res, next) => {
  await Tour.findOneAndRemove({_id: req.params.id});
  req.flash('success', 'Successfully deleted');
  res.redirect('/tours');
}));
  const mimetypes = {
    "image/jpeg": "jpg",
    "image/gif": "gif",
    "image/png": "png"
  };
  const upload = multer({
    dest: 'tmp',
    fileFilter: (req, file, cb) => {
      var ext = mimetypes[file.mimetype];
      if (!ext) {
        return cb(new Error('Only image files are allowed!'), false)
      }
      cb(null, true);
    }
  });
router.post('/', needAuth, upload.single('img'), catchErrors(async (req, res, next) => {//몽고에서 고유의 아이디를 주기에......
  const user = req.user;
  var tour = new Tour({
    title: req.body.title,
    author: user._id,
    content: req.body.content,
    price: req.body.price,
    tags: req.body.tags.split(" ").map(e => e.trim()),
  });
  if (req.file) {
    const dest = path.join(__dirname, '../public/images/uploads/');
    console.log("File ->", req.file);
    const filename = req.file.filename + "." + mimetypes[req.file.mimetype];
    await s3.upload(req.file.path, dest + filename);
    tour.img = "/images/uploads/" + filename;
  }
  await tour.save();
  req.flash('success', 'Successfully posted');
  res.redirect('/tours');
}));

router.post('/:id/reviews', needAuth, catchErrors(async (req, res, next) => {
  const user = req.user;
  const tour = await Tour.findById(req.params.id);


  if (!tour) {
    req.flash('danger', 'Not exist tour');
    return res.redirect('back');
  }

  var review = new Review({
    author: user._id,
    tour: tour._id,
    content: req.body.content,
    star: req.body.star
  });
  await review.save();
  tour.numReviews++;
  await tour.save();

  req.flash('success', 'Successfully reviewed');
  res.redirect(`/tours/${req.params.id}`);
}));



module.exports = router;