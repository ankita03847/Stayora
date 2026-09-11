if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const dns = require("dns");
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
  // Use system default if setServers fails
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const listings = require("./route/listingexpress.js");
const reviews = require("./route/reviewexpress.js");
const bookingRoutes = require("./route/bookingexpress.js");
const dashboardRoutes = require("./route/dashboardexpress.js");
const session = require("express-session");
const connectMongo = require("connect-mongo");
const MongoStore = connectMongo.default || connectMongo.MongoStore || connectMongo;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const Booking = require("./models/booking.js");
const signuser = require("./route/signuser.js");
const loginUser = require("./route/login.js");
const usercontroller = require("./controllers/user.js");
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));

// Database connection URL: uses MongoDB Atlas in production, local fallback for offline dev
const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/hunter";
const secret = process.env.SECRET || "thisissecretkey";

async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

// Persistent Session Store in MongoDB
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: secret,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR IN MONGO SESSION STORE:", err);
});

const sessionOptions = {
  store: store,
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(async (req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;

  if (req.user) {
    try {
      res.locals.pendingCount = await Booking.countDocuments({
        owner: req.user._id,
        status: "pending",
      });
    } catch (e) {
      res.locals.pendingCount = 0;
    }
  } else {
    res.locals.pendingCount = 0;
  }

  next();
});

// Root route: redirect directly to listings
app.get("/", (req, res) => {
  res.redirect("/listing");
});

// Application Routes
app.use("/", bookingRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/listing", listings);
app.use("/listing/:id/reviews", reviews);
app.use("/signuser", signuser);
app.use("/loginUser", loginUser);
app.get("/logout", usercontroller.logout);

// 404 handler
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Global error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { err });
});

const port = process.env.PORT || 8080;
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = app;
