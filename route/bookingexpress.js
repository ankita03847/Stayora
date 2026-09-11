const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync");
const { isloggedIn } = require("../middleware.js");
const bookingController = require("../controllers/booking.js");

// Guest submits booking request
router.post("/listing/:id/book", isloggedIn, WrapAsync(bookingController.createBooking));

// Guest views "My Bookings"
router.get("/bookings", isloggedIn, WrapAsync(bookingController.myBookings));

// Guest cancels booking request
router.post("/bookings/:id/cancel", isloggedIn, WrapAsync(bookingController.cancelBooking));

// Owner accepts booking request
router.post("/bookings/:id/accept", isloggedIn, WrapAsync(bookingController.acceptBooking));

// Owner rejects booking request
router.post("/bookings/:id/reject", isloggedIn, WrapAsync(bookingController.rejectBooking));

module.exports = router;
