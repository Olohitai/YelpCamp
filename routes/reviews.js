const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/catchAsync");
const Campground = require("../models/campground.js");
const Review = require("../models/review");
const { validateReview } = require("../middleware");

//Review Routes
router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();

    await campground.save();
    req.flash("success", "Created new review");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Delete a pARTICULAR REVIEW
router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    // res.send(req.params);
    const { id, reviewId } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Deleted review");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

module.exports = router;
