



const checkSession = (req,res,next)=>{
    if(req.session.user){
        res.redirect('/user/home')
    }
    else{
        next();
    }
}

//logout middleware
const logoutHome = (req,res,next)=>{
    if(req.session.user){
        next()
    }
    else{
        res.redirect('/user/home')
    }
}


const checkProfile = (req,res,next)=>{
    if(req.session.user){
        next();
    }
    else{
        res.redirect('/user/login')
    }
}

const loginHome = (req,res,next)=>{
    if(req.session.user){
        res.redirect('/user/home')
    }
    else{
        next()
    }
}




module.exports={checkSession,logoutHome,checkProfile,loginHome}  

