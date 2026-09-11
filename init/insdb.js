if (process.env.NODE_ENV != "production") {
  require("dotenv").config({ path: "./.env" });
}

const dns = require("dns");
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {}

const mongoose = require("mongoose");
const Listing = require("../models/listing");
const User = require("../models/user");
const initDB = require("./data.js");

const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/hunter";

async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then(() => {
    console.log("Connected to MongoDB Atlas for seeding...");
    initDatabase();
  })
  .catch((err) => {
    console.log("Connection error:", err);
  });

const initDatabase = async () => {
  try {
    await Listing.deleteMany({});

    // Ensure a default host user exists
    let host = await User.findOne({ username: "stayora_host" });
    if (!host) {
      const newHost = new User({ email: "host@stayora.com", username: "stayora_host" });
      host = await User.register(newHost, "StayoraHost123");
      console.log("Created default host account: stayora_host");
    }

    const categories = [
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
    ];

    const seededListings = initDB.data.map((obj, index) => ({
      ...obj,
      owner: host._id,
      category: categories[index % categories.length],
      maxGuests: 4,
    }));

    await Listing.insertMany(seededListings);
    console.log("SUCCESS: Initialized Stayora database in MongoDB Atlas with", seededListings.length, "listings!");
    process.exit(0);
  } catch (e) {
    console.error("Seeding error:", e);
    process.exit(1);
  }
};
