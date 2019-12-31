// Import modules
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const config = require("./config/database");
const passport = require("passport");

// Initialize express app
const app = express();

// Connect to database
mongoose.connect(config.database, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
let db = mongoose.connection;

// Check connection
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Check for db error
db.on("error", err => {
  console.log(err);
});

// Body Parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Set public folder
app.use(express.static(path.join(__dirname, "public")));

// Set view engine
// app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Bring models
let Article = require("./models/article");

// Express session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);

// Express messages middleware
app.use(require("connect-flash")());
app.use(function(req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

// Passport config
require("./config/passport")(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Route files
app.use("/articles", require("./routes/articles"));
app.use("/users", require("./routes/users"));

app.get("*", (req, res, next) => {
  app.locals.user = req.user || null;
  res.locals.user = req.user || null;
  next();
});

// Create routes
app.get("/", (req, res) => {
  Article.find({}, (err, articles) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {
        title: "Articles",
        articles
      });
    }
  });
});

// Listen to port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
