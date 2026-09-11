const Listing = require("../models/listing");
const Booking = require("../models/booking");

module.exports.ownerDashboard = async (req, res) => {
  const ownerId = req.user._id;

  // Fetch all properties owned by user
  const listings = await Listing.find({ owner: ownerId }).sort({ createdAt: -1 });

  // Fetch all bookings for owner's properties
  const bookings = await Booking.find({ owner: ownerId })
    .populate("listing")
    .populate("guest")
    .sort({ createdAt: -1 });

  // Calculate metrics
  const totalProperties = listings.length;
  const pendingRequests = bookings.filter((b) => b.status === "pending");
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const totalEarnings = confirmedBookings.reduce(
    (acc, curr) => acc + (curr.totalPrice || 0),
    0
  );

  res.render("owner/dashboard.ejs", {
    listings,
    bookings,
    pendingRequests,
    confirmedBookings,
    totalProperties,
    totalEarnings,
  });
};
