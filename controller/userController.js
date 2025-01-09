const userSchema = require("../model/userModel");
const tempUserSchema = require("../model/tempUserModel");
const bcrypt = require("bcrypt");
const saltround = 10;
const transporter = require("../config/mailer");
const crypto = require('crypto');
const { reset } = require("nodemon");
const { session } = require("passport");

const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const userRegisterAndSendOTP = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    // Capitalize the first letter of the name
    name = capitalizeFirstLetter(name);

    // Check if the user already exists in the main collection
    const user = await userSchema.findOne({ email });
    if (user) {
      return res.render("user/login", {
        layout: false,
        message: "You have already registered. Please login.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltround);

    // Generate a 6-digit OTP
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    // Save user details in the session temporarily
    req.session.tempUser = { name, email, password: hashedPassword, verificationCode };
    console.log("Temporary user data saved in session:", req.session.tempUser);

    // Check if a temporary user already exists
    const existingTempUser = await tempUserSchema.findOne({ email });
    if (existingTempUser) {
      // Update the existing temporary user with new data and OTP
      existingTempUser.name = name;
      existingTempUser.password = hashedPassword;
      existingTempUser.verificationCode = verificationCode;
      existingTempUser.verificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes validity
      await existingTempUser.save();
    } else {
      // Create a new temporary user if no existing record is found
      const tempUser = new tempUserSchema({
        email,
        password: hashedPassword,
        name,
        verificationCode,
        verificationExpires: Date.now() + 10 * 60 * 1000, // 10 minutes validity for the OTP
      });
      await tempUser.save();
    }

    // Send the OTP via email
    await transporter.sendMail({
      from: 'EMAIL_USER',
      to: email,
      subject: 'Your OTP for Registration',
      text: `Hello ${name},\n\nYour OTP for registration is: ${verificationCode}.\n\nPlease enter this OTP to complete your registration.\n\nThank you!`,
    });

    console.log('OTP sent to email:', email);

    // Redirect to the OTP page
    res.render("user/otp", { layout: false, email });
  } catch (error) {
    console.error("Error during registration:", error);

    // Render the registration page with an error message
    res.render("user/signUp", {
      layout: false,
      message: "Something went wrong. Please try again.",
    });
  }
};


const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;


    if (!otp) {
      return res.status(400).json({ success: false, message: "OTP is required." });
    }

    // Find the temporary user based on the OTP
    const tempUser = await tempUserSchema.findOne({ verificationCode: otp });

    if (!tempUser) {
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }

    // Check if the OTP has expired
    if (tempUser.verificationExpires < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP has expired." });
    }

    // Check if the user already exists in the `userSchema`
    const existingUser = await userSchema.findOne({ email: tempUser.email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already verified. Please log in." });
    }

    // Create a new user in the `userSchema` from the `tempUserSchema` data
    const newUser = new userSchema({
      email: tempUser.email,
      name: tempUser.name, // Include other fields as necessary
      password: tempUser.password,// Ensure this is hashed before saving in `tempUser`
      isVerified: true
    });

    await newUser.save();

    // OTP is valid, proceed with session creation
    req.session.user = { email: tempUser.email, name: tempUser.name };

    // Delete the temporary user after successful verification
    await tempUserSchema.deleteOne({ _id: tempUser._id });
    res.status(200).json({ success: true, message: "OTP verified successfully!" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};



const resendOTP = async (req, res) => {
  try {
    const { email } = req.body; // Assuming the frontend sends the email in the request body

    console.log("Resending OTP for email:", email);

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    // Find the temporary user
    const tempUser = await tempUserSchema.findOne({ email });

    if (!tempUser) {
      return res.status(404).json({ success: false, message: "No temporary user found for this email." });
    }

    // Generate a new 6-digit OTP
    const newOTP = crypto.randomInt(100000, 999999).toString();
    tempUser.verificationCode = newOTP;
    tempUser.verificationExpires = Date.now() + 10 * 60 * 1000; // Extend OTP expiration for another 10 minutes
    await tempUser.save();

    // Send the new OTP via email
    await transporter.sendMail({
      from: 'EMAIL_USER',
      to: email,
      subject: 'Your OTP for Registration (Resent)',
      text: `Hello ${tempUser.name},\n\nYour new OTP for registration is: ${newOTP}.\n\nPlease use this OTP to complete your registration.\n\nThank you!`,
    });

    console.log('Resent OTP is :', newOTP);

    res.status(200).json({ success: true, message: "OTP has been resent successfully!" });
  } catch (error) {
    console.error("Error resending OTP:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const loadPassword = async (req, res) => {
  try {
    res.render("user/forgotPassword", { layout: false });
  } catch (error) {
    console.error("Error in forgot-password route:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const forgotPassword = async (req, res) => {

  try {
    const { email } = req.body;

    // Check if user exists
    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Generate a secure token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set token and expiration in the user record
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // Token valid for 15 minutes
    await user.save();

    // Send the reset email
    const resetUrl = `${req.protocol}://${req.get('host')}/user/reset-password/${resetToken}`;
    await transporter.sendMail({
      from: 'EMAIL_USER',
      to: email,
      subject: 'Password Reset Request',
      text: `Hi ${user.name},\n\nPlease click the following link to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.\n\nThank you.`,
    });

    console.log('Password reset email sent to:', email);
    console.log(resetUrl);

    res.status(200).json({ success: true, message: "Password reset email sent successfully." });
  } catch (error) {
    console.error("Error in forgot-password route:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const loadResetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    console.log("load", token)
    res.render("user/resetPassword", { layout: false, token });
  } catch (error) {
    console.error("Error in reset-password route:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash the token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    console.log("Hashed token:", hashedToken);

    // Find user with the token
    const user = await userSchema.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // Check if the token is still valid
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token." });
    }

    console.log("Proceeding to reset password");

    // Hash the new password and save it
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined; // Clear the reset token
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successfully." });
  } catch (error) {
    console.error("Error in reset-password route:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userSchema.findOne({ email });
    console.log("user data :", user);
    if (!user) {
      req.session.error = 'Invalid email or passwor by';
      const message = req.session.error;
      delete req.session.error;
      return res.render('user/login', { layout: false, message });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.session.error = 'Invalid email or password';
      const message = req.session.error;
      delete req.session.error;
      return res.render('user/login', { layout: false, message });
    }

    // Save user details in the session
    req.session.user = { name: user.name, email: user.email };
    res.redirect('/user/home');
  } catch (error) {
    console.error(error);
    res.redirect('/user/login', {message: 'Something went wrong' });
  }
};

const loadLogin = async (req, res) => {
  res.render("user/login", { layout: false });
};

const loadSignUp = async (req, res) => {
  res.render("user/signUp", { layout: false });
};

const loadHome = async (req, res) => {
  req.session.user = req.user || req.session.user;
  let user = req.session.user;

  const locals = {
    title: "online Shopping Site for furnitures",
    description: " online shopping site for furnitures with",
  };

  res.render("user/home", { layout: "user/layouts/main", locals, user });

};


const notFound = async (req, res) => {
  res.status(404).render("errorPages/page_notFound", { layout: false });

};

const loadShop = async (req, res) => {
  const user = req.session.user;
  const locals = {
    title: "online Shopping Site for furnitures",
    description: " online shopping site for furnitures with",
  };
  res.render("user/shop", { locals, user });
};

const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.redirect('/home'); // Redirect to a safe route in case of an error
    }
    res.clearCookie('connect.sid'); // Clear session cookie
    res.redirect('/user/home'); // Redirect to login after logout
  });
};


const loadProfile = async (req, res) => {
  const user = req.session.user;
  const locals = {
    title: "online Shopping Site for furnitures",
    description: " online shopping site for furnitures with",
  };
  res.render("user/profile", { locals, user });
};












module.exports = {
  loadHome,
  loadLogin,
  login,
  loadSignUp,
  loadShop,
  notFound,
  logout,
  loadProfile,
  userRegisterAndSendOTP,
  verifyOTP,
  resendOTP,
  loadPassword,
  forgotPassword,
  loadResetPassword,
  resetPassword
};
