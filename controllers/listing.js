const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const { category, search } = req.query;
  let filter = {};

  if (category && category.toLowerCase() !== "all") {
    filter.category = new RegExp(`^${category}$`, "i");
  }

  if (search && search.trim() !== "") {
    const regex = new RegExp(search.trim(), "i");
    filter.$or = [
      { title: regex },
      { location: regex },
      { country: regex },
      { category: regex },
    ];
  }

  let allListings = await Listing.find(filter);
  res.render("index.ejs", {
    allListings,
    activeCategory: category || "all",
    searchQuery: search || "",
  });
};

module.exports.rendernewform = (req, res) => {
  res.render("new.ejs");
};

module.exports.showlisting = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listing");
  }

  res.render("show.ejs", { listing });
};

module.exports.createlisting = async (req, res, next) => {
  const newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id;

  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    newlisting.image = { url, filename };
  }

  await newlisting.save();
  req.flash("success", "New listing created!");
  res.redirect("/listing");
};

module.exports.editlisting = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing you requested does not exist!");
    return res.redirect("/listing");
  }

  res.render("edit.ejs", { listing });
};

module.exports.updatelisting = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing updated!");
  res.redirect(`/listing/${id}`);
};

module.exports.deletelisting = async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  console.log(deleteListing);
  req.flash("success", "Listing deleted!");
  res.redirect("/listing");
};