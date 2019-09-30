const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/login', passport.authenticate('oauth2', {
  failureRedirect: '/login'
}), (req, res) => res.redirect('/'));

router.get('/callback', (req, res, next) => {
  passport.authenticate('oauth2', (err, user) => {
    if (err) return next(err);
    if (!user) return res.redirect('/login');
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.redirect('/profile');
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();

  res.redirect(req.session.redirect || '/');

  // const {YAHOO_AUTH_URL, YAHOO_APP_KEY, BASE_URL} = process.env;
  // res.redirect(`https://${YAHOO_AUTH_URL}/logout?client_id=${YAHOO_APP_KEY}&returnTo=${BASE_URL}`);
});

module.exports = router;
