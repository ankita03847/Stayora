const Booking = require("../models/booking");
const Listing = require("../models/listing");

// Guest submits booking request
module.exports.createBooking = async (req, res) => {
  const { id } = req.params;
  const { checkIn, checkOut, guestsCount, guestMessage } = req.body;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Property not found!");
    return res.redirect("/listing");
  }

  // Prevent owner from booking their own property
  if (listing.owner && listing.owner.equals(req.user._id)) {
    req.flash("error", "You cannot book your own property!");
    return res.redirect(`/listing/${id}`);
  }

  // Validate dates
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(start) || isNaN(end)) {
    req.flash("error", "Please provide valid check-in and check-out dates.");
    return res.redirect(`/listing/${id}`);
  }

  if (start < today) {
    req.flash("error", "Check-in date cannot be in the past.");
    return res.redirect(`/listing/${id}`);
  }

  const diffTime = end.getTime() - start.getTime();
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (nights <= 0) {
    req.flash("error", "Check-out date must be after check-in date.");
    return res.redirect(`/listing/${id}`);
  }

  // Check for overlapping confirmed bookings
  const conflictingBooking = await Booking.findOne({
    listing: id,
    status: "confirmed",
    checkIn: { $lt: end },
    checkOut: { $gt: start },
  });

  if (conflictingBooking) {
    req.flash(
      "error",
      "These dates are already booked and unavailable. Please choose different dates."
    );
    return res.redirect(`/listing/${id}`);
  }

  // Validate guest capacity
  const count = parseInt(guestsCount) || 1;
  const maxAllowed = listing.maxGuests || 4;
  if (count > maxAllowed) {
    req.flash("error", `Maximum guest capacity for this property is ${maxAllowed}.`);
    return res.redirect(`/listing/${id}`);
  }

  const totalPrice = nights * (listing.price || 0);

  const newBooking = new Booking({
    listing: id,
    guest: req.user._id,
    owner: listing.owner,
    checkIn: start,
    checkOut: end,
    guestsCount: count,
    nights,
    totalPrice,
    status: "pending",
    guestMessage: guestMessage || "",
  });

  await newBooking.save();
  req.flash("success", "Booking request submitted! The host will review your request.");
  res.redirect("/bookings");
};

// Guest views their bookings
module.exports.myBookings = async (req, res) => {
  const bookings = await Booking.find({ guest: req.user._id })
    .populate("listing")
    .populate("owner")
    .sort({ createdAt: -1 });

  res.render("bookings/index.ejs", { bookings });
};

// Guest cancels pending booking
module.exports.cancelBooking = async (req, res) => {
  const { id } = req.params;
  const booking = await Booking.findById(id);

  if (!booking) {
    req.flash("error", "Booking not found!");
    return res.redirect("/bookings");
  }

  if (!booking.guest.equals(req.user._id)) {
    req.flash("error", "Unauthorized access.");
    return res.redirect("/bookings");
  }

  if (booking.status === "cancelled" || booking.status === "rejected") {
    req.flash("error", "This booking is already cancelled or closed.");
    return res.redirect("/bookings");
  }

  booking.status = "cancelled";
  await booking.save();

  req.flash("success", "Booking request was successfully cancelled.");
  res.redirect("/bookings");
};

// Owner accepts booking request
module.exports.acceptBooking = async (req, res) => {
  const { id } = req.params;
  const booking = await Booking.findById(id).populate("listing");

  if (!booking) {
    req.flash("error", "Booking not found!");
    return res.redirect("/dashboard");
  }

  if (!booking.owner.equals(req.user._id)) {
    req.flash("error", "Unauthorized: You are not the owner of this property.");
    return res.redirect("/dashboard");
  }

  // Double check overlap before confirmation
  const conflicting = await Booking.findOne({
    _id: { $ne: booking._id },
    listing: booking.listing._id,
    status: "confirmed",
    checkIn: { $lt: booking.checkOut },
    checkOut: { $gt: booking.checkIn },
  });

  if (conflicting) {
    req.flash("error", "Cannot accept: Dates conflict with another confirmed booking.");
    return res.redirect("/dashboard");
  }

  booking.status = "confirmed";
  await booking.save();

  // Auto-decline any overlapping pending requests
  await Booking.updateMany(
    {
      _id: { $ne: booking._id },
      listing: booking.listing._id,
      status: "pending",
      checkIn: { $lt: booking.checkOut },
      checkOut: { $gt: booking.checkIn },
    },
    { status: "rejected" }
  );

  req.flash("success", "Booking confirmed! The dates are now blocked for this property.");
  res.redirect("/dashboard");
};

// Owner rejects booking request
module.exports.rejectBooking = async (req, res) => {
  const { id } = req.params;
  const booking = await Booking.findById(id);

  if (!booking) {
    req.flash("error", "Booking not found!");
    return res.redirect("/dashboard");
  }

  if (!booking.owner.equals(req.user._id)) {
    req.flash("error", "Unauthorized: You are not the owner of this property.");
    return res.redirect("/dashboard");
  }

  booking.status = "rejected";
  await booking.save();

  req.flash("success", "Booking request has been declined.");
  res.redirect("/dashboard");
};
