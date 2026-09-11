const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");

const listingSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    image: {
      filename: {
        type: String,
        default: "listingimage",
      },
      url: {
        type: String,
        default:
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=870&auto=format&fit=crop",
      },
    },
    price: Number,
    location: String,
    country: String,
    maxGuests: {
      type: Number,
      default: 4,
      min: 1,
    },
    category: {
      type: String,
      enum: [
        "Beach",
        "Windmills",
        "Modern",
        "Countryside",
        "Pools",
        "Islands",
        "Lake",
        "Skiing",
        "Castles",
        "Caves",
        "Camping",
        "Arctic",
        "Desert",
        "Barns",
        "Lux",
      ],
      default: "Beach",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
