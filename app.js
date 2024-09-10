const express=require("express");
const mongoose=require("mongoose");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const app= express();
const ExpressError=require("./utils/ExpressError.js");
app.set("view engine","ejs");
app.engine("ejs",ejsMate);
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
// app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));
const listingRouter=require("./router/listingRouter.js");
const reviewRouter=require("./router/reviewRouter.js");
const userRouter=require("./router/userRouter.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const  localpassportmongoose=require("passport-local-mongoose");
const User=require("./models/user.js");
const multer=require("multer");
const upload = multer({ dest: 'uploads/' });
// let mongourl="mongodb://127.0.0.1:27017/wanderlust"
let atlasUrl=process.env.ATLAS_URL;

main()
.then(()=>console.log("Connection sucess!")
).catch((err)=>console.log(err));
async  function main()
{
  await mongoose.connect(atlasUrl);
}
app.listen(8080,()=>
{
    console.log("Listening to port 8080");
    
});
const store=MongoStore.create({
  mongoUrl:atlasUrl,
  crypto:{
    secret:process.env.SECRET_CODE,
  },
  touchAfter:24*3600,
});
store.on("error",(err)=>
{
  console.log("Error in mongo session store",err);
  
});
let sessionOptions={
  store,
  secret:process.env.SECRET_CODE,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+1000*60*60*24*10,
    maxAge:1000*60*60*24*10,
    httpOnly:true,
  }
}
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());
app.use((req,res,next)=>
  {
    res.locals.successMsg=req.flash("success");
    res.locals.errorMsg=req.flash("error");
    res.locals.currUser=req.user;
    
    next();
  });
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>
{
   next(new ExpressError(404,"Page not found!"));
});

app.use((err,req,res,next)=>
{
    let{status=500,message="Something went wrong"}=err;    
    res.status(status).render("error.ejs",{message});
    
});
