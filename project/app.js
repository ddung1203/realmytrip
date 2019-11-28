var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var session = require('express-session');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var mongoose   = require('mongoose');
var passport = require('passport');

var index = require('./routes/index');
var users = require('./routes/users');
var tours = require('./routes/tours');

var passportConfig = require('./lib/passport-config');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

app.locals.moment = require('moment');
app.locals.querystring = require('querystring');

mongoose.Promise = global.Promise;
const connStr = 'mongodb+srv://project:project@cluster0-clfxh.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(connStr, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
mongoose.connection.on('error', console.error);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(methodOverride('_method', {methods: ['POST', 'GET']}));

app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  debug: true,
  sourceMap: true
}));

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'long-long-long-secret-string-1313513tefgwdsvbjkvasd'
}));

app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.flashMessages = req.flash();
  next();
});

app.use('/', index);
app.use('/users', users);
app.use('/tours', tours);
require('./routes/auth')(app, passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
