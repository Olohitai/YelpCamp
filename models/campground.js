const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;
//Instead of doing CampgroundSchema = new mongoose.Schema we assigned Schema to be mongoose.Schema
const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      //deleting many based of on _id in doc.reviews
      _id: {
        $in: doc.reviews,
      },
    });
  }
});
// This middleware is only triggered when we delete a campground with the Campground.findByIdAndDelete(id) in  app.js ;
// doc is basically an object contaning the body of the campground being deleted
// like the _id, title, reviews[_id, body,rating],location....
// console.log(doc);
// we are checking if anything is being deleted if yes we want to bulk delete the review associated with  that campground by
// checking if the _id) is in doc.reviews
module.exports = mongoose.model("Campground", CampgroundSchema);
