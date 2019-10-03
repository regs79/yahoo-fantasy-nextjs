require("dotenv").config();
const express = require("express");
const http = require("http");
const next = require("next");
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-oauth2");
const uid = require("uid-safe");
const authRoutes = require("./routes/auth-routes");
const YahooFantasy = require('yahoo-fantasy');
const request = require("request");
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
  dir: "./src"
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  const sessionConfig = {
    secret: uid.sync(18),
    cookie: {
      maxAge: 86400 * 1000
    },
    resave: false,
    saveUninitialized: true
  };
  server.use(session(sessionConfig));

  const YahooStrategy = new OAuth2Strategy(
    {
      authorizationURL: process.env.YAHOO_AUTH_URL,
      tokenURL: process.env.YAHOO_TOKEN_URL,
      clientID: process.env.YAHOO_CLIENT_ID,
      clientSecret: process.env.YAHOO_CLIENT_SECRET,
      callbackURL: process.env.YAHOO_CALLBACK_URL,
    },

    function(accessToken, refreshToken, params, profile, done) {
      var options = {
        url:
          'https://social.yahooapis.com/v1/user/' +
          params.xoauth_yahoo_guid +
          '/profile?format=json',
        method: 'get',
        json: true,
        auth: {
          bearer: accessToken
        }
      };

      request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          var userObj = {
            id: body.profile.guiid,
            name: body.profile.nickname,
            avatar: body.profile.image.imageUrl,
            memberSince: body.profile.memberSince,
            accessToken: accessToken,
            refreshToken: refreshToken,
          };

          server.yf.setUserToken(accessToken);

          return done(null, userObj);
        }
      });
    }
  )

  passport.use(YahooStrategy);
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  server.use(passport.initialize());
  server.use(passport.session());
  server.use(authRoutes);

  const restrictAccess = (req, res, next) => {
    if (!req.isAuthenticated()) return res.redirect("/login");
    next();
  };

  server.yf = new YahooFantasy(process.env.YAHOO_CLIENT_ID, process.env.YAHOO_CLIENT_SECRET);

  server.use("/profile", restrictAccess);

  server.get('/api/games', function(req, res) {
    server.yf.user.games()
    .then(function(response) {
      const games = res.json(response.games);
      return(games);
    })
    .catch(function (error) {
      console.log('server error getting user games', error)
    })
  })

  server.get('/api/teams/:game_key', function(req, res) {
    server.yf.teams.games(req.params.game_key)
    .then(function(response) {
      const teams = res.json(response);
      return(teams);
    })
    .catch(function (error) {
      console.log('server error getting user teams', error)
    })
  })

  server.get("*", handle);

  http.createServer(server).listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
  });
});
