const express=require("express");
const router=express.Router();
const wrapasync=require("../utils/wrapasync.js");
const ExpressError=require("../utils/ExpressError.js");
const User=require("../models/user.js");
const passport = require("passport");
const {savedUrl}=require("../middleware.js");
router.get("/signup",(req,res)=>
{
    res.render("user/signup.ejs")
    
});
router.post("/signup",async(req,res)=>
{
    try{let{username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);
    req.logIn(registeredUser,(err)=>
    {
        if(err){
            next(err)
        }
        req.flash("success","Welcome you signed in to wanderlust");
        res.redirect("/listings");
    });
}
    catch(e)
    {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
})
router.get("/login",(req,res)=>
{
    res.render("user/login.ejs")
    
});
router.post("/login",savedUrl,passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
}),async(req,res)=>
{
    req.flash("success","welcome you logged in");
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
});
router.get("/logout",(req,res)=>
{
    req.logOut((err)=>
    {
        if(err)
        {
            return next(err);
        }
        req.flash("success","Logged you out!");
        res.redirect("/listings")
    });
});
module.exports=router;