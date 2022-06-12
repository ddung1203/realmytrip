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
var passportSocketIo = require('passport.socketio');
var index = require('./routes/index');
var users = require('./routes/users');
var tours = require('./routes/tours');
var reservations = require('./routes/reservations');

var passportConfig = require('./lib/passport-config');


module.exports =(app, io) => {
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

  mongoose.connect(connStr, { useNewUrlParser: true, useUnifiedTopology: true });
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

  const sessionStore = new session.MemoryStore();
  const sessionId = 'realmytrip.sid';
  const sessionSecret =  'TODO: change this secret string for your own'
  // session을 사용할 수 있도록.
  app.use(session({
    name: sessionId,
    resave: true,
    saveUninitialized: true,
    store: sessionStore,
    secret: sessionSecret
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


  io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,       // the same middleware you registrer in express
    key:          sessionId,       // the name of the cookie where express/connect stores its session_id
    secret:       sessionSecret,    // the session_secret to parse the cookie
    store:        sessionStore,        // we NEED to use a sessionstore. no memorystore please
    passport:     passport,
    success:      (data, accept) => {
      console.log('successful connection to socket.io');
      accept(null, true);
    }, 
    fail:         (data, message, error, accept) => {
      // 실패 혹은 로그인 안된 경우
      console.log('failed connection to socket.io:', message);
      accept(null, false);
    }
  }));


  // connection 요청이 온 경우
  io.on('connection', socket => {
    console.log('socket connection!');
    if (socket.request.user.logged_in) {
      // 로그인이 된 경우에만 join 요청을 받는다.
      socket.emit('welcome');
      socket.on('join', data => {
        // 본인의 ID에 해당하는 채널에 가입시킨다.
        socket.join(socket.request.user._id.toString());
      });
    }
  });

  app.use('/', index);
  app.use('/users', users);
  app.use('/tours', tours);
  app.use('/reservations', reservations);
  require('./routes/auth')(app, passport);
  app.use('/api', require('./routes/api'));

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

  return app;
}