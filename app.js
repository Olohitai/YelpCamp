const express = require("express");
const { default: mongoose } = require("mongoose");
const path = require("path");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");

const flash = require("connect-flash");
const ExpressError = require("./utilities/ExpressError");
const app = express();

const campgroundsRoutes = require("./routes/campgrounds");
const usersRoutes = require("./routes/users");
const reviewsRoutes = require("./routes/reviews");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

//Connect to Monogoose
mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(console.log("Database Connected"))
  .catch((error) => console.error.bind(error, "connection error"));
// Error After Connection
mongoose.connection.on("error", (err) => {
  console.error("connection error", err);
});

//Tells Express that we want to use ejsMate to parse the data instead of the default
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));
const sessionConfig = {
  secret: "mysecretsession",
  resave: false,
  saveUninitialized: true,
  cookie: {
    HttpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

//Serialize and Deserialize deals with how information is stored and recieved in a session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  // check if  /login or / does not contain the req.orignalUrl
  // if true the set session.returnTO to be te url
  if (!["/login", "/"].includes(req.originalUrl)) {
    req.session.returnTo = req.originalUrl;
  }
  res.locals.signedUser = req.user; //Used in navbar.ejs to show and hide the login register and logout links
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/campgrounds", campgroundsRoutes);
app.use("/", usersRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);
app.get("/", (req, res) => {
  res.send("Hello from yelp camp");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});
app.use((err, req, res, next) => {
  if (!err.message) err.message = "Something went wrong";
  const { statusCode = 404 } = err;
  res.status(statusCode).render("error", { err });
});
app.listen(3000, (req, res) => {
  console.log("Listening on port 3000 ");
});
