const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const userAuth = require("../middleware/userAuth");
const passport = require("passport");


router.get("/login",userController.loadLogin)
router.post("/login",userController.login)
router.get("/signUp",userController.loadSignUp)
router.post("/signUp",userController.userRegisterAndSendOTP)
router.get("/home",userController.loadHome)
router.get("/logout",userController.logout)

router.post('/verifyOTP',userController.verifyOTP);

router.post('/resendOTP',userController.resendOTP);

router.get('/forgot-password',userController.loadPassword);
router.post('/forgot-password',userController.forgotPassword);

router.get('/reset-password/:token',userController.loadResetPassword);
router.post('/reset-password/:token',userController.resetPassword);

router.get("/auth/google",passport.authenticate('google',{scope:['profile','email']}));
router.get("/auth/google/callback",passport.authenticate('google',{failureRedirect:'/user/signUp'}),userController.loadHome);

router.get("/profile",userAuth.checkProfile,userController.loadProfile)

router.get("/shop",userController.loadShop)

router.get('*',userController.notFound)

module.exports = router