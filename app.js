require("dotenv").config();
const express = require("express");
// const mongoose = require("mongoose");
const session = require("express-session")
const expressLayout = require('express-ejs-layouts');
const userRoutes = require("./routes/user");
// const adminRoutes = require("./routes/admin");
const path = require("path");
const connectDB = require("./config/connectDB");

const app = express();
const PORT = process.env.PORT || 30001


//connect database
connectDB();
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Set the view engine to EJS
app.use(expressLayout)
app.set('layout','user/layouts/main');
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//serve static files
app.use(express.static("public"));

// Initialize session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'yourSecretKey', // Replace with a secure key
    resave: false, // Avoid resaving session data if not modified
    saveUninitialized: false, // Don't save uninitialized sessions
    cookie: { secure: false, maxAge: 1000 * 60 * 60 }, // Adjust `secure` to `true` in production
   
  })
);

//for cache handling
app.use((req, res, next) => {
  res.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.set("Surrogate-Control", "no-store");
  next();
});

app.use("/", userRoutes);
//app.use("/", adminRoutes);

//Routes
app.use("/admin/api", userRoutes);

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}/`);
});