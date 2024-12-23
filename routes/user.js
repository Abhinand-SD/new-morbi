const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const userAuth = require("../middleware/userAuth");
  

router.get( "/",userController.loadHome)
router.get("/login",userAuth.checkSession,userController.loadLogin)
router.post("/login",userAuth.checkSession,userController.login)
router.get("/signUp",userController.loadSignUp)
router.post("/signUp",userController.userRegister,userController.sendVerification)
router.get("/home",userController.loadHome)
router.get("/logout",userController.logout)


router.get("/profile",userAuth.checkProfile,userController.loadProfile)

router.get("/shop",userController.loadShop)

router.get('*',userController.notFound)

module.exports = router