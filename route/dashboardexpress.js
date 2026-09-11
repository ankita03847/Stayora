const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync");
const { isloggedIn } = require("../middleware.js");
const dashboardController = require("../controllers/dashboard.js");

// Owner Dashboard Overview
router.get("/", isloggedIn, WrapAsync(dashboardController.ownerDashboard));

module.exports = router;
