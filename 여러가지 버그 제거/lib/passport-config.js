const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');

module.exports = function(passport) {//module.exports로 하는게 이 object가 넘어가느거임
  passport.serializeUser((user, done) => {//passport는 그냥 변수, serial, deserial 해줘야함
    done(null, user.id);//serial은 
  });

  passport.deserializeUser((id, done) =>  {
    User.findById(id, done);//err가 있으면 done에 err넘기고 없으면 진행
  });

  passport.use('local-signin', new LocalStrategy({//보통 username, password받고 valid하는지 callback으로 
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  }, async (req, email, password, done) => {//passport-local에 들어가서 공식문서 봐야함
    try {//async await에 대한..?
      const user = await User.findOne({email: email});
      if (user && await user.validatePassword(password)) {
        return done(null, user, req.flash('success', 'Welcome!'));
      }
      return done(null, false, req.flash('danger', 'Invalid email or password'));//디비가 맞는지 모르니까 우리가 검증해준거임
    } catch(err) {
      done(err);
    }
  }));

  passport.use(new FacebookStrategy({//모듈을 그냥 사용, 정보를 수정해야함
    // 이 부분을 여러분 Facebook App의 정보로 수정해야 합니다.
    clientID : '1202055523314324',
    clientSecret : '326c84cace30e7761f76b1b2aacd84e9',
    callbackURL : 'http://localhost:3000/auth/facebook/callback',
    profileFields : ['email', 'name', 'picture']
  }, async (token, refreshToken, profile, done) => {
    console.log('Facebook', profile); // profile 정보로 뭐가 넘어오나 보자.
    try {
      var email = (profile.emails && profile.emails[0]) ? profile.emails[0].value : '';
      var picture = (profile.photos && profile.photos[0]) ? profile.photos[0].value : '';
      var name = (profile.displayName) ? profile.displayName : 
        [profile.name.givenName, profile.name.middleName, profile.name.familyName]
          .filter(e => e).join(' ');
      console.log(email, picture, name, profile.name);
      // 같은 facebook id를 가진 사용자가 있나?
      var user = await User.findOne({'facebook.id': profile.id});
      if (!user) {
        // 없다면, 혹시 같은 email이라도 가진 사용자가 있나?
        if (email) {
          user = await User.findOne({email: email});//이미 이메일이 있는
        }
        if (!user) {
          // 그것도 없다면 새로 만들어야지.
          user = new User({name: name});
          user.email =  email ? email : `__unknown-${user._id}@no-email.com`;//이메일이 없으면 이메일이 없다는 규칙을 직접 만든거임, 가짜이메일
        }
        // facebook id가 없는 사용자는 해당 id를 등록
        user.facebook.id = profile.id;
        user.facebook.photo = picture;
      }
      user.facebook.token = profile.token;
      await user.save();
      return done(null, user);
    } catch (err) {
      done(err);
    }
  }));
};
