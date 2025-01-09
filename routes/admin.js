const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");
const adminAuth = require("../middleware/adminAuth");




router.get("/login",adminController.loadLogin);
router.post("/login",adminController.login);

router.get("/dashboard",adminController.loadHome);
router.get("/products",adminController.loadProducts);
router.get("/addproduct",adminController.addProduct);
router.put("/editproduct/:id",adminController.editProduct);
router.put("/deleteproduct/:id",adminController.deleteProduct);
router.get("/orderlist",adminController.loadOrderList);
router.get("/orderDetails",adminController.loadOrderDetails);
router.get("/category",adminController.loadCategory);








router.get("*",adminController.notFound);




module.exports = router
