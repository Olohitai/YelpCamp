const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const catcAsync = require("../utilities/catchAsync");

const authenticate = () => {
  return passport.authenticate("local", {
    //The failureFlash is what causes the flash when we have an error
    //This ispassport working hand-in-hand with flash
    failureFlash: true,
    failureRedirect: "/login",
  });
};

// const validateCampground = (req, res, next) => {
//   const { error } = campgroundSchema.validate(req.body);

//   if (error) {
//     const msg = error.details.map((el) => el.message).join(",");

//     throw new ExpressError(`${error.name}: ${msg}`, 400);
//   } else next();
// };

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catcAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.logIn(registeredUser, (err) => {
        if (err) return next(err);
        else {
          req.flash("success", "Welcome to YelpCamp");
          res.redirect("/campgrounds");
        }
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/register");
    }
  })
);
router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post("/login", authenticate(), (req, res) => {
  //authenticate is not a middleware its just a function thats why i had to call ie()
  //unlike validateCampground and ValidateReview
  req.flash("success", "Welcome Back!");
  //Look for what req.session.returnTo is ..see middleware.js and
  // app.use(the one with res.local) in app.js
  const redirectUrl = req.session.returnTo;

  //DELETE THE SESSION AFTERWARDS
  delete req.session.returnTo;
  console.log(req.session);
  //When I am about to login that middleware(app.use in app.js) will check if in the login route  or the / route there is orignalUrl if not it will add it
  // then the moment I login  this one here redirects me to whatever that url was
  res.redirect(redirectUrl);
});

router.get("/logout", (req, res) => {
  //logOut is a method added to our request object via passport
  req.logOut();
  req.flash("success", "Goodbye");
  res.redirect("/campgrounds");
});
module.exports = router;
