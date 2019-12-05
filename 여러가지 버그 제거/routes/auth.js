module.exports = (app, passport) => {
    app.get('/signin', (req, res, next) => {
      res.render('signin');
    });
  
    app.post('/signin', passport.authenticate('local-signin', {//우리가 authenticate만들었으니 넘기면 됨
      successRedirect : '/', // redirect to the secure profile section
      failureRedirect : '/signin', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
    }));
  
    app.get('/auth/facebook',
      passport.authenticate('facebook', { scope : 'email' })
    );
  
    app.get('/auth/facebook/callback',//페북에서 인증 받고 여기로 넘겨옴, passport-config에 callbackURL에 기술되어있다
      passport.authenticate('facebook', {
        failureRedirect : '/signin',
        failureFlash : true // allow flash messages //밑줄 까지가 하나의 미들웨어
      }), (req, res, next) => {//성공하면 next
        req.flash('success', 'Welcome!');
        res.redirect('/');
      }
    );
  
    app.get('/signout', (req, res) => {
      req.logout();
      req.flash('success', 'Successfully signed out');
      res.redirect('/');
    });
  };
  