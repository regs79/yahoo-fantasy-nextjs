require("dotenv").config();
const express = require("express");
const http = require("http");
const next = require("next");
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-oauth2");
const uid = require("uid-safe");
const authRoutes = require("./routes/auth-routes");

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
      clientID: process.env.YAHOO_APP_KEY,
      clientSecret: process.env.YAHOO_APP_SECRET,
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

  server.use("/profile", restrictAccess);

  // handling everything else with Next.js
  server.get("*", handle);

  http.createServer(server).listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
  });
});
