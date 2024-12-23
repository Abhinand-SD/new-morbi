



const checkSession = (req,res,next)=>{
    if(req.session.user || req.session.newuser){
        res.redirect('/home')
    }
    else{
        next();
    }
}

//logout middleware
const logoutHome = (req,res,next)=>{
    if(req.session.user || req.session.newuser){
        next()
    }
    else{
        res.redirect('/home')
    }
}


const checkProfile = (req,res,next)=>{
    if(req.session.user || req.session.newuser){
        next();
    }
    else{
        res.redirect('/login')
    }
}

const loginHome = (req,res,next)=>{
    if(req.session.user || req.session.newuser){
        res.redirect('/home')
    }
    else{
        next()
    }
}




module.exports={checkSession,logoutHome,checkProfile,loginHome}  

