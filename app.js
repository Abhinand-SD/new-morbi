const passport = require("./config/passport");
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const expressLayout = require("express-ejs-layouts");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const path = require("path");
const connectDB = require("./config/connectDB");

const app = express();
const PORT = process.env.PORT || 3001; // Fixed port number

// Connect database
connectDB();

// Middleware for parsing request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set the view engine to EJS
app.use(expressLayout);
app.set("layout", "user/layouts/main");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static("public"));

//Initialize session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "alena", // Secure this in production
    resave: false, // Avoid resaving session data if not modified
    saveUninitialized: false, // Avoid saving empty sessions
    //cookie: { secure: process.env.NODE_ENV === "production", maxAge: 1000 * 60 * 60 }, // Secure in production
  })
);

// Cache control middleware
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.set("Surrogate-Control", "no-store");
  next();
});

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// User and Admin routes
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

// const bcrypt = require("bcrypt");
// const plainPassword = "@0000";
// bcrypt.hash(plainPassword, 10, (err, hash) => {
//   if (err) {
//     console.error("Error hashing password:", err);
//   } else {
//     console.log("Hashed Password:", hash);
//   }
// });

// Start the server
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
