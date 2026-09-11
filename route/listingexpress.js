const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync");
const { isloggedIn, isOwner, validateListing } = require("../middleware.js");
const listingcontroller = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Index route
router.get("/", WrapAsync(listingcontroller.index));

// New listing form
router.get("/new", isloggedIn, listingcontroller.rendernewform);

// Create route (Upload image to Cloudinary -> Validate form -> Save listing)
router.post(
  "/",
  isloggedIn,
  upload.single("image"),
  validateListing,
  WrapAsync(listingcontroller.createlisting)
);

// Show route
router.get("/:id", WrapAsync(listingcontroller.showlisting));

// Edit listing form
router.get("/:id/edit", isloggedIn, isOwner, WrapAsync(listingcontroller.editlisting));

// Update route (Upload image if provided -> Validate form -> Update listing)
router.put(
  "/:id",
  isloggedIn,
  isOwner,
  upload.single("image"),
  validateListing,
  WrapAsync(listingcontroller.updatelisting)
);

// Delete route
router.delete("/:id", isloggedIn, isOwner, WrapAsync(listingcontroller.deletelisting));

module.exports = router;