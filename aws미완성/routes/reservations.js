const express = require('express');
const Reservation = require('../models/reservation');
const Review = require('../models/review'); 
const Tour = require('../models/tour');
const User = require('../models/user');
const catchErrors = require('../lib/async-error');

const router = express.Router();


// 동일한 코드가 users.js에도 있습니다. 이것은 나중에 수정합시다.
function needAuth(req, res, next) {
  if (req.isAuthenticated()) {//이 함수가 참이면 로그인된, 거짓이면 안된
    next();
  } else {
    req.flash('danger', 'Please signin first.');
    res.redirect('/signin');
  }
}

/* GET Reservations listing. */
router.get('/', catchErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;// ||아니면 10

  var query = {};
  const term = req.query.term;
  if (term) {
    query = {$or: [
      {title: {'$regex': term, '$options': 'i'}}
    ]};//이런거 들어있는거 찾는거, i가 대소문자 안가린다
  }

  const reservations = await Reservation.paginate(query, {//무시하고 find라고 생각하셈
    sort: {createdAt: -1}, //최신글 먼저보이게
    populate: 'author', 
    page: page, limit: limit
  });
  res.render('reservations/index', {reservations: reservations, term: term, query: req.query});
}));

router.get('/new', needAuth, (req, res, next) => {
  res.render('reservations/new', {reservation: {}});
});

router.get('/:id/edit', needAuth, catchErrors(async (req, res, next) => {
  const reservation = await Reservation.findById(req.params.id);
  res.render('reservations/edit', {reservation: reservation});
}));


router.get('/:id', catchErrors(async (req, res, next) => {
  const reservation = await Reservation.findById(req.params.id).populate('author');
  const reviews = await Review.find({reservation: reservation.id}).populate('author');
  
  reservation.numReads++;    // TODO: 동일한 사람이 본 경우에 Read가 증가하지 않도록???

  await reservation.save();
  res.render('reservations/show', {reservation: reservation, reviews: reviews});
}));

router.post('/:id', catchErrors(async (req, res, next) => {
  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    req.flash('danger', 'Not exist reservation');
    return res.redirect('back');
  }
  reservation.title = req.body.title;
  reservation.numpeople = req.body.numpeople;
  reservation.start = req.body.start;
  reservation.end = req.body.end;
  reservation.rev_name = req.body.rev_name;
  reservation.phone_no = req.body.phone_no;
  reservation.price = req.body.price;
  

  await reservation.save();
  req.flash('success', 'Successfully updated');
  res.redirect('/reservations');
}));


router.delete('/:id', needAuth, catchErrors(async (req, res, next) => {
  await Reservation.findOneAndRemove({_id: req.params.id});
  req.flash('success', 'Successfully deleted');
  res.redirect('/reservations');
}));



router.post('/', needAuth, catchErrors(async (req, res, next) => {//몽고에서 고유의 아이디를 주기에......
  const user = req.user;
  var reservation = new Reservation({
    title: req.body.title,
    numpeople: req.body.numpeople,
    author: user._id,
    start: req.body.start,
    end: req.body.end,
    rev_name: req.body.rev_name,
    phone_no: req.body.phone_no,
    price: req.body.price
  });

  await reservation.save();
  req.flash('success', 'Successfully posted');
  res.redirect('/reservations');
}));

router.post('/:id/reviews', needAuth, catchErrors(async (req, res, next) => {
  const user = req.user;
  const reservation = await Reservation.findById(req.params.id);



  if (!tour) {
    req.flash('danger', 'Not exist tour');
    return res.redirect('back');
  }

  var review = new Review({
    author: user._id,
    reservation: reservation._id,
    content: req.body.content
  });
  await review.save();
  reservation.numReviews++;
  await reservation.save();

  req.flash('success', 'Successfully answered');
  res.redirect(`/reservations/${req.params.id}`);
}));


router.put('/:id', needAuth, catchErrors(async (req, res, next) => {
  const err = validateForm(req.body);
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }

  const user = await User.findById({_id: req.params.id});
  if (!user) {
    req.flash('danger', 'Not exist user.');
    return res.redirect('back');
  }

  if (!await user.validatePassword(req.body.current_password)) {
    req.flash('danger', 'Current password invalid.');
    return res.redirect('back');
  }

  user.name = req.body.name;
  user.email = req.body.email;
  user.grade = req.body.grade;
  
  
  if (req.body.password) {
    user.password = await user.generateHash(req.body.password);
  }
  await user.save();
  req.flash('success', 'Updated successfully.');
  res.redirect('/users');
}));
module.exports = router;
