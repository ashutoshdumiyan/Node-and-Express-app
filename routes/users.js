const express = require("express");
const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const flash = require("connect-flash");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const router = express.Router();

// Register Page
router.get("/register", (req, res) => {
  res.render("register");
});

// Register form submit
router.post(
  "/register",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Email is required")
      .not()
      .isEmpty(),
    check("email", "Email is not valid").isEmail(),
    check("username", "Username is required")
      .not()
      .isEmpty(),
    check("password", "Short password")
      .isLength({ min: 5 })
      .custom((value, { req, loc, path }) => {
        if (value !== req.body.password2) {
          // throw error if passwords do not match
          throw new Error("Passwords don't match");
        } else {
          return value;
        }
      })
  ],
  (req, res) => {
    let result = validationResult(req);
    if (!result.isEmpty()) {
      console.log(result);
      res.render("register", {
        result
      });
    } else {
      const user = new User();
      user.name = req.body.name;
      user.email = req.body.email;
      user.username = req.body.username;
      user.password = req.body.password;
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          console.log(err);
          res.send("<p>Something went wrong. Please try again...</p>");
        } else {
          bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
              console.log(err);
              res.send("<p>Something went wrong. Please try again...</p>");
            } else {
              user.password = hash;
              user.save(err => {
                if (err) {
                  console.log(err);
                } else {
                  req.flash("success", "You can now log in");
                  res.redirect("/users/login");
                }
              });
            }
          });
        }
      });
    }
  }
);

// Login Page
router.get("/login", (req, res) => {
  res.render("login");
});

// Login form submit
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "You have logged out successfully!");
  res.redirect("/users/login");
});

module.exports = router;
