const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const config = require("./database");
const bcrypt = require("bcryptjs");

const MSG = "Invalid credentials";

module.exports = passport => {
  // Local Strategy
  passport.use(
    new LocalStrategy(function(username, password, done) {
      User.findOne({ username: username }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: MSG });
        }
        // Match password
        bcrypt.compare(password, user.password, (err, success) => {
          if (err) throw err;
          if (success) {
            return done(null, user);
          } else {
            return done(null, false, { message: MSG });
          }
        });
      });
    })
  );
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
