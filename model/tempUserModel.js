const mongoose = require("mongoose");

const tempUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verificationCode: { type: Number, required: true },
  verificationExpires: { type: Date, default: Date.now, expires: 300 }, // Automatically deletes after 5 minutes
});

module.exports = mongoose.model("TempUser", tempUserSchema);
