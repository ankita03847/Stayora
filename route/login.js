const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveredirectUrl } = require("../middleware.js");
const usercontroller = require("../controllers/user.js");

// Render login form
router.get("/", usercontroller.renderLoginForm);

// Authenticate user
router.post(
  "/",
  saveredirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/loginUser",
    failureFlash: true,
  }),
  usercontroller.login
);

module.exports = router;