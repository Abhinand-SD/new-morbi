const userSchema = require("../model/userModel");
const bcrypt = require("bcrypt");
const saltround = 10;
const transporter = require("../config/mailer");
const crypto = require('crypto');

const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const userRegister = async (req, res) => {
  try {
    let { name, email, password } = req.body;

     // Capitalize the first letter of the name
     name = capitalizeFirstLetter(name);

    // Check if the user already exists
    const user = await userSchema.findOne({ email });
    if (user) {
      return res.render("user/login", {
        layout: false,
        message: "You have already registered. Please login.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltround);

    // Create and save the new user
    const newUser = new userSchema({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

     // Save user details in the session
    
    req.session.user = { name: newUser.name, email: newUser.email };

    console.log(req.session.user);
    res.render("user/otp", { layout: false });
   
  } catch (error) {
    console.error("Error during registration:", error);

    // Render the registration page with an error message
    res.render("user/signUp", {
      layout: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

const loadHome = async (req, res) => {
  const user  = req.session.user;
  const locals = {
    title: "online Shopping Site for furnitures",
    description: " online shopping site for furnitures with",
  };

  res.render("user/home", {locals,user});
};

const loadLogin = async (req, res) => {
  res.render("user/login", { layout: false });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userSchema.findOne({ email });
    if (!user) {
      req.session.error = 'Invalid email or password';
      const message = req.session.error;
      delete req.session.error;
      return res.render('user/login', { layout: false, message});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.session.error = 'Invalid email or password';
      const message = req.session.error;
      delete req.session.error;
      return res.render('user/login', { layout: false, message});
    }

    // Save user details in the session
    req.session.user = { name: user.name, email: user.email };
    res.redirect('/home');
  } catch (error) {
    console.error(error);
    res.render('user/login', { layout: false, message: 'Something went wrong' });
  }
};


const loadSignUp = async (req, res) => {
  res.render("user/signUp", { layout: false });
};

const notFound = async (req, res) => {
  res.status(404).render("errorPages/page_notFound", { layout: false });
};

const loadShop = async (req, res) => {

  const user  = req.session.user;
  const locals = {
    title: "online Shopping Site for furnitures",
    description: " online shopping site for furnitures with",
  };


  res.render("user/shop",{locals,user});
};

const logout = async  (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.redirect('/home'); // Redirect to a safe route in case of an error
    }
    res.clearCookie('connect.sid'); // Clear session cookie
    res.redirect('/home'); // Redirect to login after logout
  });
};


const loadProfile = async (req, res) => {
  const user  = req.session.user;
  const locals = {
    title: "online Shopping Site for furnitures",
    description: " online shopping site for furnitures with",
  };
  res.render("user/profile", {locals,user});
};













const sendVerification = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required.' });

  try {
    // Generate a verification code
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    // Check if user exists, or create a new one
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email });
    }

    user.verificationCode = verificationCode;
    user.verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // Code valid for 10 minutes
    await user.save();

    // Send the email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Verification Code',
      text: `Your verification code is ${verificationCode}`,
    });

    res.json({ message: 'Verification code sent!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending verification email.' });
  }
};

const verifyCode = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) return res.status(400).json({ message: 'Email and code are required.' });

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: 'Invalid verification code.' });
    }

    if (user.verificationExpires < new Date()) {
      return res.status(400).json({ message: 'Verification code has expired.' });
    }

    user.isVerified = true;
    user.verificationCode = undefined; // Clear the code
    user.verificationExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error verifying code.' });
  }
};






module.exports = {
  userRegister,
  loadHome,
  loadLogin,
  login,
  loadSignUp,
  loadShop,
  notFound,
  logout,
  loadProfile,
  sendVerification,
  verifyCode
};
