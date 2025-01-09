const adminSchema = require("../model/adminModel");
const bcrypt = require("bcrypt");





const loadLogin = async (req,res)=>{
    res.render("admin/login",{layout:false})
}

const login = async (req,res)=>{
    try{
        const {email,password} = req.body;
        const admin = await adminSchema.findOne({email});
        if(!admin){
            res.render("admin/login",{layout:false})
        }
        const isMatch = await bcrypt.compare(password,admin.password);
        if(!isMatch){
            res.render("admin/login",{layout:false})
        }
        req.session.admin = {name:admin.name,email:admin.email};
        res.redirect("/admin/dashboard" );
    }catch(error){
        console.log(error);
    }

}

const loadHome = async (req,res)=>{

    const admin = req.session.admin;

    const locals = {
        title: "admin dashboard",
        description: "admin dashboard for furnitures with",
      };


    res.render("admin/dashboard",{locals,layout:"admin/layout/main"});  //,admin

    
}

const loadProducts = async (req,res)=>{
    res.render("./admin/productlist",{layout: false});
}

const addProduct = async (req,res)=>{
    res.render("./admin/addproduct",{layout: "./admin/layout/main"});
}

const editProduct = async (req,res)=>{
    res.render("./admin/editproduct",{layout: "./admin/layout/main"});
}

const deleteProduct = async (req,res)=>{
    res.render("./admin/deleteproduct",{layout: "./admin/layout/main"});
}

const loadOrderList = async (req,res)=>{
    res.render("./admin/orderlist",{layout: false});
}

const loadOrderDetails = async (req,res)=>{
    res.render("./admin/orderDetails",{layout: false});
}

const loadCategory = async (req,res)=>{
    res.render("./admin/categoryList",{layout: false});
}





const notFound = async (req,res )=>{
    res.status(404).render("errorPages/page_notFound", { layout: false });
    res.send("not found")
}

module.exports ={
    loadLogin,
    login,
    loadHome,
    loadProducts,
    addProduct,
    editProduct,
    deleteProduct,
    loadOrderList,
    loadOrderDetails,
    loadCategory,
    notFound
}