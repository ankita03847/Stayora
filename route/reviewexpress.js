const express = require("express");
const router = express.Router({mergeParams: true});
const WrapAsync= require("../utils/WrapAsync");
const ExpressError =require("../utils/ExpressError");
const {reviewSchema } = require("../public/js/schema.js");
const Review= require('../models/reviews');
const Listing = require("../models/listing");
const {isloggedIn, isreviewsAuthor, validatereview} = require('../middleware.js');
const reviewcontroller= require('../controllers/reviews.js');


//create reviews
router.post("/", isloggedIn, validatereview, WrapAsync (reviewcontroller.createreview));

//delete reviews
router.delete("/:reviewId",isloggedIn,isreviewsAuthor,
  WrapAsync(reviewcontroller.deletereview));

module.exports= router;

