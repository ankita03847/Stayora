const Review = require('../models/reviews');
const Listing = require("../models/listing");

module.exports.createreview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  listing.reviews.push(newReview._id);

  await newReview.save();
  await listing.save();

  req.flash("success", "Review posted!");
  res.redirect(`/listing/${listing._id}`);
};

module.exports.deletereview = async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId }
  });

  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted!");
  res.redirect(`/listing/${id}`);
};
