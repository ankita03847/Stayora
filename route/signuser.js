const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync.js");
const usercontroller = require("../controllers/user.js");

// Render signup form
router.get("/", usercontroller.renderSignupForm);

// Register user
router.post("/", WrapAsync(usercontroller.signup));

module.exports = router;
