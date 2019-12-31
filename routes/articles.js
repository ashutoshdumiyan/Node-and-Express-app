const express = require("express");
const { check, validationResult } = require("express-validator");
const flash = require("connect-flash");

const router = express.Router();

// Bring models
let Article = require("../models/article");

let currentArticle = {};

// Edit article form
router.get("/edit/:id", (req, res) => {
  // Line below this will convert String to ObjectID if required
  // let id = mongoose.Types.ObjectId(req.params.id);
  let article = new Article();
  article.title = currentArticle.title;
  article.author = currentArticle.author;
  article.body = currentArticle.body;
  article._id = currentArticle._id;
  res.render("edit_article", {
    article
  });
});

// Edit article POST request from the form
router.post("/edit/:id", (req, res) => {
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;
  let query = { _id: req.params.id };
  Article.updateOne(query, article, err => {
    if (err) {
      console.log(err);
    } else {
      req.flash("success", "Article updated");
      res.redirect("/");
    }
  });
});

// Add article route
router.get("/add", (req, res) => {
  res.render("add_article", {
    title: "Add Article"
  });
});

// Add submit route
router.post(
  "/add",
  [
    check("title", "Title is required")
      .not()
      .isEmpty(),
    check("author", "Author is required")
      .not()
      .isEmpty(),
    check("body", "Body is required")
      .not()
      .isEmpty()
  ],
  (req, res) => {
    let result = validationResult(req);
    if (!result.isEmpty()) {
      console.log(result);
      res.render("add_article", {
        title: "Add Article",
        result
      });
    } else {
      let article = new Article();
      article.title = req.body.title;
      article.author = req.body.author;
      article.body = req.body.body;

      article.save(err => {
        if (err) {
          console.log(err);
        } else {
          req.flash("success", "Article added");
          res.redirect("/");
        }
      });
    }
  }
);

// Delete article route
router.delete("/:id", (req, res) => {
  let query = { _id: req.params.id };
  Article.deleteOne(query, err => {
    if (err) {
      console.log(err);
    } else {
      console.log("Deleted Successfully");
    }
    res.send("Deleted Successfully");
  });
});

// Get single article
router.get("/:id", (req, res) => {
  // Line below this will convert String to ObjectID if required
  // let id = mongoose.Types.ObjectId(req.params.id);
  Article.findById(req.params.id, (err, article) => {
    if (err) {
      console.log(err);
    } else {
      currentArticle = article;
      res.render("view_article", {
        article
      });
    }
  });
});

module.exports = router;
