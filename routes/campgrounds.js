const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

//Displays all Campgrounds
router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);
//Form to Create new Campground
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});
//Creates new Campground on server
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    //we added the .campground because in our new.ejs form name is grouped under campground
    //req.body.campground =   title: 'Lohi Camp',
    //   location: 'Fnigeria',
    //   image: 'https://travel.home.sndimg.com/content/dam/images/travel/fullset/2013/07/16/9a/california-camping.rend.hgtvcom.616.347.suffix/1491591965392.jpeg',
    //   price: '56',
    //   description: 'bodied'
    // }

    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    // if (!req.body.campground) {
    //   throw new ExpressError("Invalid Campround Data", 400);
    // }
    req.flash("success", "Successfully made a new campground");
    res.redirect(`campgrounds/${campground._id}`);
  })
);
//Show Details of one Campground
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
      .populate("reviews")
      .populate("author");
    console.log(campground);
    if (!campground) {
      req.flash("error", "Cannot find campground");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);
//Form to edit specfic Campground
router.get(
  "/:id/:edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    // The campground is in middleware.js
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "Cannot find campground");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(
      req.params.id,
      req.body.campground
    );
    req.flash("success", "Sucessfully Updated Campground");
    res.redirect(`${campground._id}`);
  }
);
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

module.exports = router;
